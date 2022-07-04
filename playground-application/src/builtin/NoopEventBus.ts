import {
  type AnyDomainEvent,
} from '@karrotmini/playground-core/src/framework';
import {
  type IEventBus,
} from '../runtime';

export class NoopEventBus implements IEventBus {
  push(...published: AnyDomainEvent[]): void {
    // noop
  }

  pull(): AnyDomainEvent[] {
    return [];
  }
}
