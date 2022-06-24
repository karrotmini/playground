import {
  type AnyAggregate,
} from '../framework';

export class CommandError extends TypeError {
  constructor(aggregate: AnyAggregate) {
    super(`failed to commit ${aggregate.typename}(${aggregate.id})`);
  }
}
