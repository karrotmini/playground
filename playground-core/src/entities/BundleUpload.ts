import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Snapshot,
} from '../framework';
import {
  type BundleUploadedEvent,
  type BundleDeletedEvent,
} from '../events';
import {
  type AppID,
  type UserProfileID,
}from '../entities';

export type BundleUploadID = GUID<'BundleUpload'>;
export const BundleUploadID = registerGUID<BundleUploadID>();

export type BundleUploadEvent = (
  | BundleUploadedEvent
  | BundleDeletedEvent
);

export type BundleUploadSnapshot = Snapshot<1, {
  appId: AppID,
  uploaderId: UserProfileID,
  createdAt: number,
  deletedAt: number | null,
}>;
export const BundleUploadSnapshot = registerSnapshot<BundleUploadSnapshot>();

export type BundleUploadDTO = {
  id: BundleUploadID,
  appId: AppID,
  uploaderId: UserProfileID,
  isDeleted: boolean,
};

export class BundleUpload extends Aggregate<
BundleUploadID,
BundleUploadEvent,
BundleUploadSnapshot,
BundleUploadDTO
> {
  readonly typename = 'BundleUpload' as const;
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

  toJSON(): BundleUploadDTO {
    return {
      id: this.id,
      appId: this.appId,
      uploaderId: this.uploaderId,
      isDeleted: this.isDeleted,
    };
  }

  validate(state: Partial<BundleUploadSnapshot>): state is BundleUploadSnapshot {
    return typeof state.appId === 'string' &&
      typeof state.uploaderId === 'string' &&
      typeof state.createdAt === 'number' &&
      'deletedAt' in state &&
      (state.deletedAt === null || typeof state.deletedAt === 'number');
  }

  reduce(current: BundleUploadSnapshot, event: BundleUploadEvent): void {
    switch (event.eventName) {
      case 'BundleUploaded': {
        current.appId = event.eventPayload.appId;
        current.uploaderId = event.eventPayload.uploaderId;
        current.createdAt = event.eventDate;
        current.deletedAt = null;
        break;
      }
      case 'BundleDeleted': {
        current.deletedAt = event.eventDate;
        break;
      }
    }
  }

  static create(props: {
    id: BundleUploadID,
    uploaderId: UserProfileID,
    appId: AppID,
  }) {
    const id = props.id;
    const upload = new BundleUpload(id);
    upload.$publishEvent({
      aggregateName: upload.typename,
      aggregateId: id,
      eventName: 'BundleUploaded',
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
      eventName: 'BundleDeleted',
      eventDate: Date.now(),
      eventPayload: {
      },
    });
  }
}
