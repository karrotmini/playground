import { vi } from 'vitest';
import { webcrypto } from 'node:crypto';

import {
  MemoryEventBus,
  VitestApplicationContext,
} from '../builtin';
import {
  Executor,
} from '../runtime';

export function setupVitestContext() {
  const eventBus = new MemoryEventBus();
  const context = new VitestApplicationContext({
    eventBus,
    vitestUtils: vi,
    crypto: webcrypto as unknown as Crypto,
  });
  const executor = new Executor({
    context,
  });
  return { eventBus, context, executor };
}
