import { webcrypto } from 'node:crypto';
import {
  vi,
  expect,
  type Mock,
} from 'vitest';

import {
  type AnyDomainEvent,
} from '@karrotmini/playground-core/src/framework';
import {
  MemoryEventBus,
  VitestApplicationContext,
} from '../builtin';
import {
  Executor,
} from '../runtime';

export type SpyOf<T extends object, K extends keyof T> = (
  T[K] extends ((...args: infer TArgs) => infer TReturn)
    ? Mock<TArgs, TReturn>
    : never
);

export function eventMatch<E extends AnyDomainEvent>(
  eventPartial: Partial<E>,
): E {
  return expect.objectContaining(eventPartial);
}

export function setupApplication() {
  const eventBus = new MemoryEventBus();

  const context = new VitestApplicationContext({
    eventBus,
    vitestUtils: vi,
    crypto: webcrypto as unknown as Crypto,
  });

  const executor = new Executor({
    context: { application: context },
  });

  return { eventBus, context, executor };
}
