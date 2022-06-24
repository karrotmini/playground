import { AnyDomainEvent } from '../../framework';

export interface IEventBus<Event extends AnyDomainEvent = AnyDomainEvent> {
  push(...event: Event[]): Promise<void>;
  // subscribe(): Generator<Event, void>;
}
