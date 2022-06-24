import DataLoader from 'dataloader';
import {
  type AnyAggregate,
} from '../../framework';

import {
  type Repositories,
  type RepositoryLoaders,
  type Services,
} from './_common';

import { type IEventBus } from './EventBus';
import { type Authorization } from './Authorization';
import { Mutator, type IMutator } from './Mutator';
import { type IReporter } from './Reporter';
import { type ITracer } from './Tracer';

export type ApplicationEnvironment = {
  crypto: Crypto,

  vars: Readonly<{
    HOSTNAME_PATTERN: string,
  }>,

  secrets: Readonly<{
    CREDENTIAL_SECRET: string,
  }>,
};

export interface IApplicationContext {
  env: Readonly<ApplicationEnvironment>;
  services: Readonly<Services>;
  repos: Readonly<Repositories>;
  loaders: Readonly<RepositoryLoaders>;
  mutator: Readonly<Mutator>;
  authz: Authorization;
  reporter: IReporter;
  tracer: ITracer;
}

export class ApplicationContext implements IApplicationContext {
  #env: Readonly<ApplicationEnvironment>;
  #services: Readonly<Services>;
  #repos: Readonly<Repositories>;
  #loaders: Readonly<RepositoryLoaders>;
  #authz: Authorization;
  #reporter: IReporter;
  #tracer: ITracer;
  #mutator: IMutator;

  get env() {
    return this.#env;
  }

  get services() {
    return this.#services;
  }

  get repos() {
    return this.#repos;
  }

  get authz() {
    return this.#authz;
  }

  get reporter() {
    return this.#reporter;
  }

  get tracer() {
    return this.#tracer;
  }

  get loaders() {
    return this.#loaders;
  }

  get mutator() {
    return this.#mutator;
  }

  toObject(): Readonly<IApplicationContext> {
    return {
      env: this.env,
      services: this.services,
      repos: this.repos,
      loaders: this.loaders,
      mutator: this.mutator,
      authz: this.authz,
      reporter: this.reporter,
      tracer: this.tracer,
    };
  }

  constructor(config: {
    env: ApplicationEnvironment,
    repos: Repositories,
    services: Services,
    eventBus: IEventBus,
    reporter: IReporter,
    tracer: ITracer,
    authz: Authorization,
    aggregateCache?: Map<string, Promise<AnyAggregate | null>>,
  }) {
    this.#env = config.env;
    this.#services = config.services;
    this.#repos = config.repos;
    this.#authz = config.authz;
    this.#reporter = config.reporter;
    this.#tracer = config.tracer;

    this.#loaders = ApplicationContext.deriveLoaders(
      config.repos,
      config.aggregateCache,
    );

    this.#mutator = new Mutator({
      eventBus: config.eventBus,
      repos: config.repos,
      loaders: this.#loaders,
    });
  }

  static deriveLoaders(
    repos: Repositories,
    aggregateCache = new Map<string, Promise<AnyAggregate | null>>(),
  ): RepositoryLoaders {
    const makeCacheKeyFn = (typename: string) => (key: string) => {
      return `${typename}:${key}`;
    };
    return Object.fromEntries(
      Object.entries(repos)
        .map(([name, repo]) => [
          name,
          new DataLoader<string, AnyAggregate | null>(keys => {
            return Promise.all(
              keys.map(key => {
                try {
                  return repo.aggregate(key as any);
                } catch (e: any) {
                  return e as Error;
                }
              }),
            );
          }, {
            cacheKeyFn: makeCacheKeyFn(name),
            cache: true,
            cacheMap: aggregateCache,
          }),
        ] as const),
    ) as RepositoryLoaders;
  }
}
