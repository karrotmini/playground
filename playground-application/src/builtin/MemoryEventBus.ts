import {
  type AnyDomainEvent,
} from '@karrotmini/playground-core/src/framework';
import {
  type IEventBus,
} from '../runtime';

export class MemoryEventBus implements IEventBus {
  #events: AnyDomainEvent[] = [];

  push(...published: AnyDomainEvent[]): void {
    this.#events.push(...published);
  }

  pull(): AnyDomainEvent[] {
    const events = this.#events.slice();
    this.#events = [];
    return events;
  }
}
