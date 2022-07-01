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

export type ApplicationEnvironment = Readonly<{
  crypto: Crypto,
  vars: Readonly<{
    HOSTNAME_PATTERN: string,
  }>,
  secrets: Readonly<{
    CREDENTIAL_SECRET: string,
  }>,
}>;

export interface IApplicationContext {
  env: ApplicationEnvironment;
  services: Services;
  repos: Repositories;
  loaders: RepositoryLoaders;
  mutator: IMutator;
  reporter: IReporter;
  tracer: ITracer;
  authz: Authorization;
}

export function makeApplicationContext(config: {
  env: ApplicationEnvironment,
  repos: Repositories,
  services: Services,
  eventBus: IEventBus,
  reporter: IReporter,
  tracer: ITracer,
  authz: Authorization,
  aggregateCache?: Map<string, Promise<AnyAggregate | null>>,
}): Readonly<IApplicationContext> {
  const loaders = deriveLoaders({ repos: config.repos });
  const mutator = new Mutator({
    eventBus: config.eventBus,
    repos: config.repos,
    loaders,
  });
  return Object.freeze({
    ...config,
    loaders,
    mutator,
  });
}

export function deriveLoaders(config: {
  repos: Repositories,
  aggregateCache?: Map<string, Promise<AnyAggregate | null>>,
}): RepositoryLoaders {
  const makeCacheKeyFn = (typename: string) => (key: string) => {
    return `${typename}:${key}`;
  };
  return Object.fromEntries(
    Object.entries(config.repos)
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
          cacheMap: config.aggregateCache || new Map(),
        }),
      ] as const),
  ) as RepositoryLoaders;
}
