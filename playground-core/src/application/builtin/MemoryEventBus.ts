import {
  type AnyDomainEvent,
} from '../../framework';
import {
  type IEventBus,
} from '../runtime';

export class MemoryEventBus implements IEventBus {
  #events: AnyDomainEvent[] = [];

  async push(...published: AnyDomainEvent[]): Promise<void> {
    this.#events.push(...published);
  }

  pull(): AnyDomainEvent[] {
    const events = this.#events.slice();
    this.#events = [];
    return events;
  }
}
