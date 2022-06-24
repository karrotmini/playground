import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Resource,
  type Snapshot,
  type Serializable,
} from '../framework';
import {
  type AppCreatedEvent,
  type AppDeletedEvent,
  type AppManifestUpdatedEvent,
  type AppVersionUpdatedEvent,
} from '../events';
import {
  AppManifest,
  type AppManifestPayload,
  type AppBundleUpload,
  type AppBundleID,
  type AppBundleUploadID,
  type AppBundleTemplate,
  type AppBundleTemplateID,
  type CustomHostID,
  type UserProfileID,
} from '../entities';
import {
  InvariantError,
} from '../errors';

export type AppID = GUID<'App'>;
export const AppID = registerGUID<AppID>();

export type AppEvent = (
  | AppCreatedEvent
  | AppDeletedEvent
  | AppManifestUpdatedEvent
  | AppVersionUpdatedEvent
);

export type AppSnapshot = Snapshot<1, {
  createdAt: number,
  deletedAt: number | null,
  manifest: AppManifestPayload,
  versions: AppBundleID[],
  ownerId: UserProfileID,
  isTemplate: boolean,
  customHostId: CustomHostID,
}>;
export const AppSnapshot = registerSnapshot<AppSnapshot>();

export type AppDTO = Serializable<{
  id: AppID,
  manifest: AppManifestPayload,
  ownerId: UserProfileID,
  customHostId: CustomHostID,
  currentVersion: number,
  currentBundle: (
    | { type: 'template', id: AppBundleTemplateID }
    | { type: 'upload', id: AppBundleUploadID }
  ),
}>;

export class App
  extends Aggregate<AppID, AppEvent, AppSnapshot, AppDTO>
  implements Resource
{
  readonly typename = 'App' as const;
  readonly snapshotVersion = 1 as const;

  get manifest(): AppManifest {
    return new AppManifest(this.$snapshot.manifest);
  }

  get ownerId() {
    return this.$snapshot.ownerId;
  }

  get customHostId() {
    return this.$snapshot.customHostId;
  }

  get currentVersion() {
    return this.$snapshot.versions.length;
  }

  get currentBundle() {
    const latestBundleId = this.$snapshot.versions.at(-1);
    if (!latestBundleId) {
      throw new InvariantError('App doesn\'t have bundle');
    }
    if (this.$snapshot.isTemplate) {
      return {
        type: 'template' as const,
        id: latestBundleId as AppBundleTemplateID,
      };
    } else {
      return {
        type: 'upload' as const,
        id: latestBundleId as AppBundleUploadID,
      };
    }
  }

  get isDeleted() {
    return this.$snapshot.deletedAt === null;
  }

  toJSON(): AppDTO {
    return Object.freeze({
      id: this.id,
      manifest: this.manifest.toJSON(),
      currentVersion: this.currentVersion,
      ownerId: this.ownerId,
      customHostId: this.customHostId,
      currentBundle: this.currentBundle,
    });
  }

  validate(state: Partial<AppSnapshot>): state is AppSnapshot {
    if (!state.manifest) {
      return false;
    }
    new AppManifest(state.manifest);
    return true;
  }

  reduce(current: AppSnapshot, event: AppEvent): void {
    switch (event.eventName) {
      case 'AppCreated': {
        current.createdAt = event.eventDate;
        current.deletedAt = null;
        current.manifest = event.eventPayload.manifest;
        current.ownerId = event.eventPayload.ownerId;
        current.customHostId = event.eventPayload.customHostId;
        current.isTemplate = event.eventPayload.initialBundle.type === 'template';
        current.versions = [event.eventPayload.initialBundle.id];
        break;
      }
      case 'AppManifestUpdated': {
        current.manifest = event.eventPayload.manifest;
        break;
      }
      case 'AppVersionUpdated': {
        current.versions.push(event.eventPayload.to.bundleId);
        current.isTemplate = event.eventPayload.to.isTemplate;
        break;
      }
      case 'AppDeleted': {
        current.deletedAt = event.eventDate;
        break;
      }
    }
  }

  static createFromTemplate(props: {
    id: AppID,
    manifest: AppManifest,
    ownerId: UserProfileID,
    template: AppBundleTemplate,
    customHostId: CustomHostID,
  }): App {
    const id = props.id;
    const app = new App(id);
    app.$publishEvent({
      aggregateName: app.typename,
      aggregateId: id,
      eventName: 'AppCreated',
      eventDate: Date.now(),
      eventPayload: {
        manifest: props.manifest.toJSON(),
        initialBundle: {
          type: 'template',
          id: props.template.id,
        },
        ownerId: props.ownerId,
        customHostId: props.customHostId,
      },
    });
    return app;
  }

  updateBundle(upload: AppBundleUpload): void {
    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'AppVersionUpdated',
      eventDate: Date.now(),
      eventPayload: {
        from: {
          version: this.currentVersion,
          bundleId: this.currentBundle.id,
          isTemplate: this.$snapshot.isTemplate,
        },
        to: {
          version: this.currentVersion + 1,
          bundleId: upload.id,
          isTemplate: false,
        },
      },
    });
  }

  updateManifest(manifest: AppManifest): void {
    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'AppManifestUpdated',
      eventDate: Date.now(),
      eventPayload: {
        manifest: manifest.toJSON(),
      },
    });
  }

  delete(): void {
    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'AppDeleted',
      eventDate: Date.now(),
      eventPayload: {
      },
    });
  }
}
