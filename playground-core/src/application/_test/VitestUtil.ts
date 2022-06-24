import {
  expect,
  type SpyInstanceFn,
} from 'vitest';

import {
  type AnyDomainEvent,
} from '../../framework';

export type SpyOf<T extends object, K extends keyof T> = (
  T[K] extends ((...args: infer TArgs) => infer TReturn)
    ? SpyInstanceFn<TArgs, TReturn>
    : never
);

export function eventMatch<E extends AnyDomainEvent>(
  eventPartial: Partial<AnyDomainEvent>,
): E {
  return expect.objectContaining(eventPartial);
}
