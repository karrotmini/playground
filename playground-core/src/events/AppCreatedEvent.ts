import {
  type DomainEvent,
} from '../framework';
import {
  type UserProfileID,
  type CustomHostID,
  type AppManifestPayload,
} from '../entities';

export type AppCreatedEvent = DomainEvent<'App', 'AppCreated', {
  manifest: AppManifestPayload,
  ownerId: UserProfileID | null,
  customHostId: CustomHostID,
}>;
