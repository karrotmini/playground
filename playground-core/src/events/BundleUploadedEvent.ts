import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
  type UserProfileID,
} from '../entities';

export type BundleUploadedEvent = DomainEvent<'BundleUpload', 'BundleUploaded', {
  appId: AppID,
  uploaderId: UserProfileID,
}>;
