import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Snapshot,
} from '../framework';
import {
  type BundleUploadedEvent,
} from '../events';
import {
  type AppID,
  type UserProfileID,
} from '../entities';

export type BundleUploadID = GUID<'BundleUpload'>;
export const BundleUploadID = registerGUID<BundleUploadID>();

export type BundleUploadSnapshot = Snapshot<1, {
  tag: string,
  appId: AppID,
  uploaderId: UserProfileID,
  createdAt: number,
}>;
export const BundleUploadSnapshot = registerSnapshot<BundleUploadSnapshot>();

export type BundleUploadEvent = (
  | BundleUploadedEvent
);

export type BundleUploadDTO = {
  id: BundleUploadID,
  tag: string,
  appId: AppID,
  uploaderId: UserProfileID,
};

export class BundleUpload
  extends Aggregate<BundleUploadID, BundleUploadEvent, BundleUploadSnapshot, BundleUploadDTO>
{
  readonly typename = 'BundleUpload' as const;
  readonly snapshotVersion = 1 as const;

  get tag() {
    return this.$snapshot.tag;
  }

  get appId() {
    return this.$snapshot.appId;
  }

  get uploaderId() {
    return this.$snapshot.uploaderId;
  }

  toJSON(): Readonly<BundleUploadDTO> {
    return Object.freeze({
      id: this.id,
      tag: this.tag,
      appId: this.appId,
      uploaderId: this.uploaderId,
    });
  }

  validate(state: Partial<BundleUploadSnapshot>): state is BundleUploadSnapshot {
    return (
      typeof state.tag === 'string' &&
      typeof state.appId === 'string' &&
      typeof state.uploaderId === 'string' &&
      typeof state.createdAt === 'number'
    );
  }

  reduce(current: BundleUploadSnapshot, event: BundleUploadEvent): void {
    switch (event.eventName) {
      case 'BundleUploaded': {
        current.appId = event.eventPayload.appId;
        current.uploaderId = event.eventPayload.uploaderId;
        current.createdAt = event.eventDate;
        current.tag = event.eventPayload.tag;
        break;
      }
    }
  }

  static create(props: {
    id: BundleUploadID,
    uploaderId: UserProfileID,
    appId: AppID,
    tag: string,
  }) {
    const id = props.id;
    const upload = new BundleUpload(id);
    upload.$publishEvent({
      aggregateName: upload.typename,
      aggregateId: id,
      eventName: 'BundleUploaded',
      eventDate: Date.now(),
      eventPayload: {
        tag: props.tag,
        appId: props.appId,
        uploaderId: props.uploaderId,
      },
    });
    return upload;
  }
}
