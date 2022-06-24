import {
  type DomainEvent,
} from '../framework';
import {
  type UserProfileID,
  type CustomHostID,
  type AppManifestPayload,
  type AppBundleTemplateID,
  type AppBundleUploadID,
} from '../entities';

export type AppCreatedEvent = DomainEvent<'App', 'AppCreated', {
  manifest: AppManifestPayload,
  ownerId: UserProfileID,
  initialBundle: (
    | {
      type: 'template',
      id: AppBundleTemplateID,
    }
    | {
      type: 'upload',
      id: AppBundleUploadID,
    }
  ),
  customHostId: CustomHostID,
}>;
