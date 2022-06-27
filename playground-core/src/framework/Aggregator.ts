import {
  type EntityID,
  type AnyAggregate,
  type AggregateEvent,
} from '../framework';

export interface Aggregator<T extends AnyAggregate> {
  newId(): Promise<EntityID<T>>;
  aggregate(aggregateId: EntityID<T>): Promise<T | null>;
  commit(aggregate: T): Promise<Array<AggregateEvent<T>> | null>;
}
