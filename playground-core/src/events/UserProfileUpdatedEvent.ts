import {
  type DomainEvent,
} from '../framework';

export type UserProfileUpdatedEvent = DomainEvent<'UserProfile', 'UserProfileUpdated', {
  name: string | null,
  profileImageUrl: string | null,
}>;
