import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
  type UserProfileID,
} from '../entities';

export type BundleUploadedEvent = DomainEvent<'BundleUpload', 'BundleUploaded', {
  tag: string,
  appId: AppID,
  uploaderId: UserProfileID,
}>;
