import {
  Aggregate,
  type AnyDomainEvent,
} from '@karrotmini/playground-core/src/framework';
import {
  CommandError,
  ConfigurationError,
} from '@karrotmini/playground-core/src/errors';

import {
  type Repository,
  type Repositories,
  type RepositoryName,
  type RepositoryLoader,
  type RepositoryLoaders,
} from './_common';
import { type IEventBus } from './EventBus';

export interface IMutator {
  commit<AggregateMap extends { [key: string]: unknown }>(
    aggregateMap: AggregateMap,
  ): Promise<AggregateMap>;
}

export class Mutator implements IMutator {
  readonly #eventBus: IEventBus | null;
  readonly #repos: Repositories;
  readonly #loaders: RepositoryLoaders;

  constructor(config: {
    eventBus: IEventBus | null,
    repos: Repositories,
    loaders: RepositoryLoaders,
  }) {
    this.#eventBus = config.eventBus;
    this.#repos = config.repos;
    this.#loaders = config.loaders;
  }

  async commit<AggregateMap extends { [key: string]: unknown }>(
    aggregateMap: AggregateMap,
  ): Promise<AggregateMap> {
    const shouldPublish: AnyDomainEvent[] = [];

    try {
      for (const value of Object.values(aggregateMap)) {
        if (!(value instanceof Aggregate)) {
          continue;
        }

        const repo = this.#getRepository(value.typename);
        const loader = this.#getLoader(value.typename);

        const commited = await repo.commit(value as any);
        if (!commited) {
          throw new CommandError(value);
        }
        shouldPublish.push(...commited);
        loader.clear(value.id).prime(value.id, value as any);
      }
    } finally {
      if (this.#eventBus) {
        await this.#eventBus.push(
          ...shouldPublish.sort((a, b) => a.eventDate - b.eventDate),
        );
      }
      this.#cleanupEvents(aggregateMap);
    }

    return aggregateMap;
  }

  #getRepository(name: string): Repository {
    const aggregator = this.#repos[name as RepositoryName];
    if (!aggregator) {
      throw new ConfigurationError(`repository for ${name} is not configured`);
    }
    return aggregator;
  }

  #getLoader(name: string): RepositoryLoader {
    const loader = this.#loaders[name as RepositoryName];
    if (!loader) {
      throw new ConfigurationError(`loader for ${name} is not configured`);
    }
    return loader;
  }

  #cleanupEvents<AggregateMap extends { [key: string]: unknown }>(
    aggregateMap: AggregateMap,
  ) {
    for (const value of Object.values(aggregateMap)) {
      if (value instanceof Aggregate) {
        value.$pullEvents();
      }
    }
  }
}
