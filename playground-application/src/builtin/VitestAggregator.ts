import { type vi } from 'vitest';

import {
  type EntityID,
  type AnyAggregate,
  type Aggregator,
} from '@karrotmini/playground-core/src/framework';

import {
  type SpyOf,
} from '../test/helpers';

export class VitestAggregator<T extends AnyAggregate> implements Aggregator<T> {
  newId: SpyOf<Aggregator<T>, 'newId'>;
  aggregate: SpyOf<Aggregator<T>, 'aggregate'>;
  commit: SpyOf<Aggregator<T>, 'commit'>;

  instances: Map<EntityID<T>, T>;

  constructor(config: {
    vitestUtils: typeof vi,
    newId: () => string,
  }) {
    this.instances = new Map();

    this.newId = config.vitestUtils.fn();
    this.newId.mockImplementation(() => {
      return config.newId() as EntityID<T>;
    });

    this.aggregate = config.vitestUtils.fn();
    this.aggregate.mockImplementation(async id => {
      return this.instances.get(id) ?? null;
    });

    this.commit = config.vitestUtils.fn();
    this.commit.mockImplementation(async aggregate => {
      const events = aggregate.$pullEvents();
      this.instances.set(
        aggregate.id as EntityID<T>,
        aggregate,
      );
      return events as any;
    });
  }
}
