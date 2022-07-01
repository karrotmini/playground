import {
  type AnyDomainEvent,
} from '../../framework';
import {
  type IEventBus,
} from '../runtime';

export class NoopEventBus implements IEventBus {
  async push(...published: AnyDomainEvent[]): Promise<void> {
    // noop
  }

  pull(): AnyDomainEvent[] {
    return [];
  }
}
