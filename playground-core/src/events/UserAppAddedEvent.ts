import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
  type UserProfileID,
} from '../entities';

export type UserAppAddedEvent = DomainEvent<'UserProfile', 'UserAppAdded', {
  appId: AppID,
  userProfileId: UserProfileID,
}>;
