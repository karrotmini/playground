import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
  type UserProfileID,
} from '../entities';

export type AppBundleUploadedEvent = DomainEvent<'AppBundleUpload', 'AppBundleUploaded', {
  appId: AppID,
  uploaderId: UserProfileID,
}>;
