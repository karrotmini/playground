import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
} from '../entities';

export type UserAppAddedEvent = DomainEvent<'UserProfile', 'UserAppAdded', {
  appId: AppID,
}>;
