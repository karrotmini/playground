import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Snapshot,
  type MustSerializable,
} from '../framework';
import {
  type AppCreatedEvent,
  type AppDeploymentCreatedEvent,
  type AppDeploymentDeletedEvent,
  type AppManifestUpdatedEvent,
} from '../events';
import {
  AppManifest,
  type AppManifestPayload,
  type BundleRef,
  type BundleTemplateID,
  type CustomHostID,
  type DeploymentRef,
  type UserProfileID,
} from '../entities';
import {
  ProtectedDeploymentError,
} from '../errors';

export type AppID = GUID<'App'>;
export const AppID = registerGUID<AppID>();

export type AppEvent = (
  | AppCreatedEvent
  | AppDeploymentCreatedEvent
  | AppDeploymentDeletedEvent
  | AppManifestUpdatedEvent
);

export type AppSnapshot = Snapshot<1, {
  createdAt: number,
  ownerId: UserProfileID | null,
  customHostId: CustomHostID,
  manifest: AppManifestPayload,
  deployments: Record<DeploymentRef['name'], DeploymentRef>,
}>;
export const AppSnapshot = registerSnapshot<AppSnapshot>();

export type AppDTO = MustSerializable<{
  id: AppID,
  manifest: AppManifestPayload,
  ownerId: UserProfileID | null,
  customHostId: CustomHostID,
  deployments: Record<DeploymentRef['name'], DeploymentRef>,
}>;

export class App
  extends Aggregate<AppID, AppEvent, AppSnapshot, AppDTO>
{
  static DEFAULT_DEPLOYMENT_NAME = 'live' as const;

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

  get deployments() {
    return structuredClone(this.$snapshot.deployments);
  }

  get liveDeployment() {
    return this.deployments[App.DEFAULT_DEPLOYMENT_NAME];
  }

  toJSON(): Readonly<AppDTO> {
    return Object.freeze({
      id: this.id,
      manifest: this.manifest.toJSON(),
      ownerId: this.ownerId,
      customHostId: this.customHostId,
      deployments: this.deployments,
    });
  }

  validate(state: Partial<AppSnapshot>): state is AppSnapshot {
    if (!state.manifest) {
      return false;
    }

    new AppManifest(state.manifest);

    if (!state.deployments) {
      return false;
    }

    return true;
  }

  reduce(current: AppSnapshot, event: AppEvent): void {
    switch (event.eventName) {
      case 'AppCreated': {
        current.createdAt = event.eventDate;
        current.manifest = event.eventPayload.manifest;
        current.ownerId = event.eventPayload.ownerId;
        current.customHostId = event.eventPayload.customHostId;
        current.deployments = {};
        break;
      }
      case 'AppDeploymentCreated': {
        current.deployments[event.eventPayload.deployment.name] = {
          name: event.eventPayload.deployment.name,
          deployedAt: event.eventDate,
          bundle: event.eventPayload.deployment.bundle,
          customHostId: event.eventPayload.deployment.customHostId,
        };
        break;
      };
      case 'AppDeploymentDeleted': {
        delete current.deployments[event.eventPayload.deploymentName];
        break;
      };
      case 'AppManifestUpdated': {
        current.manifest = event.eventPayload.manifest;
        break;
      }
    }
  }

  static bootstrapFromTemplate(props: {
    id: AppID,
    manifest: AppManifest,
    ownerId: UserProfileID | null,
    customHostId: CustomHostID,
    templateId: BundleTemplateID,
  }): {
    app: App,
    deployment: DeploymentRef,
  } {
    const id = props.id;
    const app = new App(id);

    app.$publishEvent({
      aggregateName: app.typename,
      aggregateId: id,
      eventName: 'AppCreated',
      eventDate: Date.now(),
      eventPayload: {
        manifest: props.manifest.toJSON(),
        ownerId: props.ownerId,
        customHostId: props.customHostId,
      },
    });

    const deployment = app.createDeployment({
      name: App.DEFAULT_DEPLOYMENT_NAME,
      bundle: {
        type: 'template',
        id: props.templateId
      },
      customHostId: props.customHostId,
    });

    return { app, deployment };
  }

  updateManifest(props: {
    manifest: AppManifest,
  }): void {
    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'AppManifestUpdated',
      eventDate: Date.now(),
      eventPayload: {
        manifest: props.manifest.toJSON(),
      },
    });
  }

  createDeployment(props: {
    name: string,
    bundle: BundleRef,
    customHostId: CustomHostID,
  }): DeploymentRef {
    const eventDate = Date.now();

    const deploymentRef: DeploymentRef = {
      name: props.name,
      bundle: props.bundle,
      customHostId: props.customHostId,
      deployedAt: eventDate,
    };

    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'AppDeploymentCreated',
      eventDate,
      eventPayload: {
        deployment: deploymentRef,
      },
    });

    return deploymentRef;
  }

  deleteDeployment(props: {
    name: string,
  }): void {
    if (props.name === App.DEFAULT_DEPLOYMENT_NAME) {
      throw new ProtectedDeploymentError(App.DEFAULT_DEPLOYMENT_NAME);
    }

    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'AppDeploymentDeleted',
      eventDate: Date.now(),
      eventPayload: {
        deploymentName: props.name,
      },
    });
  }
}
