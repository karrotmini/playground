import {
  type AnyDomainEvent,
} from '@karrotmini/playground-core/src/framework';

export interface IEventBus<Event extends AnyDomainEvent = AnyDomainEvent> {
  push(...event: Event[]): void;
  // subscribe(): Generator<Event, void>;
}
