import { Entity } from './Entity';
import { type AnyGUID } from './GUID';
import { type AnyDomainEvent } from './Event';
import { type AnySnapshot } from './Snapshot';
import { type SerializableObject } from './Serializable';

export type AnyAggregate = Aggregate<any, any, any, any>;

export type AggregateEvent<T extends AnyAggregate> = (
  T extends Aggregate<any, infer Event, any, any>
    ? Event
    : never
);

export type AggregateSnapshot<T extends AnyAggregate> = (
  T extends Aggregate<any, any, infer Snapshot, any>
    ? Snapshot
    : never
);

export type AggregateDTO<T extends AnyAggregate> = (
  T extends Aggregate<any, any, any, infer DTO>
    ? DTO
    : never
);

/**
 * 스냅샷 밸리데이션 실패하는 경우, 사용 전에 초기화를 안했거나, reduce 코드를 잘못 작성했거나
 *
 * 상태 복원 방법: 코드 수정 후 시스템 재시작 (필요한 경우 스냅샷 버전 업데이트)
 */
export class InvalidStateError extends TypeError {
  constructor(aggregate: AnyAggregate) {
    super(
      `invalid state at ${aggregate.typename}(${aggregate.id}),
requires version ${aggregate.snapshotVersion}`,
    );
  }
}

export abstract class Aggregate<
  ID extends AnyGUID,
  Event extends AnyDomainEvent<ID['__typename']>,
  Snapshot extends AnySnapshot,
  DTO extends SerializableObject,
> extends Entity<ID> {
  #events: Event[];

  #valid = false;
  #state: Partial<Snapshot>;

  get $valid(): boolean {
    return this.#valid ||= this.validate(this.#state);
  }

  get $snapshot(): Snapshot {
    if (this.$valid) {
      return this.#state as Snapshot;
    }
    throw new InvalidStateError(this);
  }

  constructor(id: ID, snapshot?: Snapshot) {
    super(id);
    this.#events = [];
    this.#state = {};

    if (snapshot) {
      const state = structuredClone(snapshot);
      this.#state = state;
      this.#valid = true;
    }
  }

  readonly abstract typename: ID['__typename'];
  readonly abstract snapshotVersion: Snapshot['__version'];

  abstract validate(state: Partial<Snapshot>): state is Snapshot;

  abstract reduce(current: Partial<Snapshot>, event: Event): void;

  abstract toJSON(): Readonly<DTO>;

  $publishEvent(event: Event): void {
    this.#events.push(event);
    this.reduce(this.#state, event);
  }

  $restoreState(events: Event[]): void {
    for (const event of events) {
      this.reduce(this.#state, event);
    }
  }

  $pullEvents(): Event[] {
    const events = this.#events.slice();
    this.#events = [];
    return events;
  }
}
