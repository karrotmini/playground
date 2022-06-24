import {
  type DomainEvent,
} from '../framework';

type Empty = Record<string, never>;
export type AppDeletedEvent = DomainEvent<'App', 'AppDeleted', Empty>;
