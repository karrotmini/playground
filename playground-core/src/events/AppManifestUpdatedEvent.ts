import {
  type DomainEvent,
} from '../framework';
import {
  type AppManifestPayload,
} from '../entities';

export type AppManifestUpdatedEvent = DomainEvent<'App', 'AppManifestUpdated', {
  manifest: AppManifestPayload,
}>;
