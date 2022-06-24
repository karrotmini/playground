import {
  type DomainEvent,
} from '../framework';

export type UserProfileCreatedEvent = DomainEvent<'UserProfile', 'UserProfileCreated', {
  name: string | null,
  profileImageUrl: string | null,
}>;
