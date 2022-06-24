import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Snapshot,
} from '../framework';
import {
  type AppBundleUploadedEvent,
  type AppBundleDeletedEvent,
} from '../events';
import {
  type AppID,
  type UserProfileID,
}from '../entities';

export type AppBundleUploadID = GUID<'AppBundleUpload'>;
export const AppBundleUploadID = registerGUID<AppBundleUploadID>();

export type AppBundleUploadEvent = (
  | AppBundleUploadedEvent
  | AppBundleDeletedEvent
);

export type AppBundleUploadSnapshot = Snapshot<1, {
  appId: AppID,
  uploaderId: UserProfileID,
  createdAt: number,
  deletedAt: number | null,
}>;
export const AppBundleUploadSnapshot = registerSnapshot<AppBundleUploadSnapshot>();

export type AppBundleUploadDTO = {
  id: AppBundleUploadID,
  appId: AppID,
  uploaderId: UserProfileID,
  isDeleted: boolean,
};

export class AppBundleUpload extends Aggregate<
AppBundleUploadID,
AppBundleUploadEvent,
AppBundleUploadSnapshot,
AppBundleUploadDTO
> {
  readonly typename = 'AppBundleUpload' as const;
  readonly snapshotVersion = 1 as const;

  get isDeleted() {
    return this.$snapshot.deletedAt == null;
  }

  get appId() {
    return this.$snapshot.appId;
  }

  get uploaderId() {
    return this.$snapshot.uploaderId;
  }

  toJSON(): AppBundleUploadDTO {
    return {
      id: this.id,
      appId: this.appId,
      uploaderId: this.uploaderId,
      isDeleted: this.isDeleted,
    };
  }

  validate(state: Partial<AppBundleUploadSnapshot>): state is AppBundleUploadSnapshot {
    return typeof state.appId === 'string' &&
      typeof state.uploaderId === 'string' &&
      typeof state.createdAt === 'number' &&
      'deletedAt' in state &&
      (state.deletedAt === null || typeof state.deletedAt === 'number');
  }

  reduce(current: AppBundleUploadSnapshot, event: AppBundleUploadEvent): void {
    switch (event.eventName) {
      case 'AppBundleUploaded': {
        current.appId = event.eventPayload.appId;
        current.uploaderId = event.eventPayload.uploaderId;
        current.createdAt = event.eventDate;
        current.deletedAt = null;
        break;
      }
      case 'AppBundleDeleted': {
        current.deletedAt = event.eventDate;
        break;
      }
    }
  }

  static create(props: {
    id: AppBundleUploadID,
    uploaderId: UserProfileID,
    appId: AppID,
  }) {
    const id = props.id;
    const upload = new AppBundleUpload(id);
    upload.$publishEvent({
      aggregateName: upload.typename,
      aggregateId: id,
      eventName: 'AppBundleUploaded',
      eventDate: Date.now(),
      eventPayload: {
        appId: props.appId,
        uploaderId: props.uploaderId,
      },
    });
    return upload;
  }

  delete() {
    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'AppBundleDeleted',
      eventDate: Date.now(),
      eventPayload: {
      },
    });
  }
}
