import {
  type EntityID,
  type AnyAggregate,
  type AnyDomainEvent,
  type AggregateEvent,
  type AggregateSnapshot,
} from '@karrotmini/playground-core/src';

import { HexaKV, type SPO } from './HexaKV';

type DurableObjectAggregatorProtocolStub<T extends AnyAggregate> = {
  aggregate: (
    id: EntityID<T>,
  ) => Promise<AggregateSnapshot<T> | null>,

  commit: (
    id: EntityID<T>,
    events: Array<AggregateEvent<T>>,
  ) => Promise<Array<AggregateEvent<T>> | null>,
};

type DurableObjectAggregatorProtocolWire<T extends AnyAggregate> = (
  | { op: 'AGGREGATE', id: EntityID<T> }
  | { op: 'COMMIT', id: EntityID<T>, events: Array<AggregateEvent<T>> }
);

type DurableObjectAggregatorBookmark<T extends AnyAggregate> = [
  cursor: string | null,
  snapshot: AggregateSnapshot<T>,
];

type EventStoreKey = SPO<AggregateID, EventName, EventOrder>;

type AggregateID = string & { __BRAND__: 'AggregateID' };
function AggregateID(aggregate: AnyAggregate) {
  return `${aggregate.typename}:${aggregate.id}` as AggregateID;
}

type EventName = string & { __BRAND__: 'EventName' };
function EventName(event: AnyDomainEvent) {
  return event.eventName as EventName;
}

type EventOrder = string & { __BRAND__: 'EventOrder' };
function EventOrder(event: AnyDomainEvent, serial: number) {
  return `${event.eventDate}:${serial}` as EventOrder;
}

export abstract class AggregatorDurableObject<T extends AnyAggregate>
  implements DurableObject
{
  static SNAPSHOT_PER = 20;
  static BOOKMARK_PREFIX = `bookmark:`;

  #state: DurableObjectState;
  #eventStore: HexaKV<EventStoreKey, AggregateEvent<T>>;
  #deferredAggregate: Promise<T> | null;
  #commitCount: number;

  // Note: ESBuild minify 이후 class 이름이 바뀌는 버그가 있으므로 메뉴얼하게 관리할 것
  abstract readonly aggregateName: EntityID<T>['__typename'];

  abstract spawn(id: EntityID<T>, snapshot?: AggregateSnapshot<T>): T;

  constructor(state: DurableObjectState, env: WranglerEnv) {
    this.#state = state;
    this.#eventStore = new HexaKV({ namespace: env.KV_EVENT_STORE });
    this.#deferredAggregate = null;
    this.#commitCount = 0;
  }

  async #restore(id: EntityID<T>) {
    let aggregate = this.spawn(id);

    const bookmark = await this.#getBookmark(aggregate.snapshotVersion);
    if (bookmark) {
      aggregate = this.spawn(id, bookmark[1]);
    }

    const events: Array<AggregateEvent<T>> = [];
    let cursor = bookmark?.[0];
    let listCompleted = false;
    while (!listCompleted) {
      const result = await this.#eventStore.listPO({
        predicate: { s: AggregateID(aggregate) },
        cursor,
      });
      events.push(...result.values);
      cursor = result.cursor;
      listCompleted = result.listCompleted;
    }

    aggregate.$restoreState(events);
    if (!aggregate.$valid) {
      throw new Error(`failed to restore ${aggregate.typename}(${aggregate.id})`);
    }

    return aggregate;
  }

  async #saveBookmark(version: number, bookmark: DurableObjectAggregatorBookmark<T>) {
    const key = `bookmark:${version}:${Date.now()}`;
    await this.#state.storage.put(key, bookmark);
  }

  async #getBookmark(version: number) {
    const prefix = `bookmark:${version}`;
    const result = await this.#state.storage.list<DurableObjectAggregatorBookmark<T>>({
      prefix,
      reverse: true,
      limit: 1,
    });
    const [bookmark = null] = result.values();
    return bookmark;
  }

  async fetch(request: Request) {
    type WireMessage = DurableObjectAggregatorProtocolWire<T>;
    const wire = await request.json<WireMessage>();

    this.#deferredAggregate ||= this.#restore(wire.id);
    const aggregate = await this.#deferredAggregate;

    switch (wire.op) {
      case 'AGGREGATE': {
        return new Response(
          JSON.stringify(aggregate.$snapshot),
        );
      }

      case 'COMMIT': {
        try {
          let serial = 0;
          let cursor: string | null = null;
          for (const event of wire.events) {
            const key: EventStoreKey = {
              s: AggregateID(aggregate),
              p: EventName(event),
              o: EventOrder(event, serial++),
            };
            await this.#eventStore.put(key, event);
            cursor = HexaKV.SPO(key);
          }
          aggregate.$restoreState(wire.events);
          this.#commitCount += serial;

          if (cursor && this.#commitCount >= AggregatorDurableObject.SNAPSHOT_PER) {
            await this.#saveBookmark(
              aggregate.snapshotVersion,
              [cursor, aggregate.$snapshot],
            );
            this.#commitCount = 0;
          }
          return new Response(
            JSON.stringify(wire.events),
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({
              message: err.message || err.toString(),
              stack: err.stack,
            }),
            {
              status: 500,
            },
          );
        }
      }
    }
  }
}

interface ErrorLike {
  message: string;
  stack?: string;
}

class AggregatorDurableObjectError extends Error {
  constructor({ message, stack }: ErrorLike) {
    super(message);
    if (stack) {
      this.stack = stack;
    }
  }
}

export abstract class AggregatorProtocolClient<Aggregate extends AnyAggregate> {
  #namespace: DurableObjectNamespace;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    this.#namespace = config.namespace;
  }

  abstract newId(): Promise<EntityID<Aggregate>>;
  abstract convertId(id: EntityID<Aggregate>): DurableObjectId;
  abstract spawn(
    id: EntityID<Aggregate>,
    snapshot: AggregateSnapshot<Aggregate>,
  ): Aggregate;

  async aggregate(id: EntityID<Aggregate>): Promise<Aggregate | null> {
    const objectId = this.convertId(id);
    const stub = this.#namespace.get(objectId);
    const protocol = this.#wrapStub(stub);
    try {
      const snapshot = await protocol.aggregate(id);
      return snapshot && this.spawn(id, snapshot);
    } catch {
      // TODO: report
      return null;
    }
  }

  async commit(aggregate: Aggregate): Promise<Array<AggregateEvent<Aggregate>> | null> {
    const objectId = this.convertId(aggregate.id);
    const stub = this.#namespace.get(objectId);
    const protocol = this.#wrapStub(stub);
    try {
      const events = aggregate.$pullEvents() as Array<AggregateEvent<Aggregate>>;
      const commitedEvent = await protocol.commit(aggregate.id, events);
      return commitedEvent;
    } catch {
      // TODO: report
      return null;
    }
  }

  #wrapStub(stub: DurableObjectStub): DurableObjectAggregatorProtocolStub<Aggregate> {
    async function request<T>(wire: DurableObjectAggregatorProtocolWire<Aggregate>) {
      try {
        const response = await stub
          .fetch('http://aggregator/', {
            method: 'POST',
            body: JSON.stringify(wire),
          });
        if (response.ok) {
          const data = await response.json<T>();
          return data;
        } else {
          const cause = await response.json<ErrorLike>();
          throw new AggregatorDurableObjectError(cause);
        }
      } catch (err: unknown) {
        // TODO: report
        return null;
      }
    }
    return {
      aggregate(id) {
        return request({ op: 'AGGREGATE', id });
      },
      commit(id, events) {
        return request({ op: 'COMMIT', id, events });
      },
    };
  }
}
