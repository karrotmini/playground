import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Snapshot,
  type MustSerializable,
} from '../framework';
import {
  type AppCreatedFromTemplateEvent,
  type AppDeploymentCreatedEvent,
  type AppDeploymentDeletedEvent,
} from '../events';
import {
  type BundleRef,
  type BundleTemplateID,
  type DeploymentRef,
  CustomHostID,
  UserProfileID,
} from '../entities';
import {
  ProtectedDeploymentError,
} from '../errors';

import {
  writeAppSnapshotV1,
  type AppSnapshotV1,
} from './_snapshots';

export type AppID = GUID<'App'>;
export const AppID = registerGUID<AppID>();

export type AppEvent = (
  | AppCreatedFromTemplateEvent
  | AppDeploymentCreatedEvent
  | AppDeploymentDeletedEvent
);

export type AppSnapshot = Snapshot<1, AppSnapshotV1>;
export const AppSnapshot = registerSnapshot<AppSnapshot>();

export type AppDTO = MustSerializable<{
  id: AppID,
  // Note: 나중에 필요할 때 추가해...
}>;

export class App
  extends Aggregate<AppID, AppEvent, AppSnapshot, AppDTO>
{
  static DEFAULT_DEPLOYMENT_NAME = 'live' as const;

  readonly typename = 'App' as const;
  readonly snapshotVersion = 1 as const;

  get ownerId(): UserProfileID | null {
    return this.$snapshot.owner_id
      ? UserProfileID(this.$snapshot.owner_id)
      : null;
  }

  get customHostId(): CustomHostID {
    return CustomHostID(this.$snapshot.custom_host_id);
  }

  toJSON(): Readonly<AppDTO> {
    return Object.freeze({
      id: this.id,
    });
  }

  validate(state: Partial<AppSnapshot>): state is AppSnapshot {
    try {
      writeAppSnapshotV1(state as AppSnapshot);
      return true;
    } catch {
      return false;
    }
  }

  reduce(current: AppSnapshot, event: AppEvent): void {
    switch (event.eventName) {
      case 'AppCreatedFromTemplate': {
        current.created_at = event.eventDate;
        current.name = event.eventPayload.name;
        current.tenant_id = event.eventPayload.tenantId;
        current.owner_id = event.eventPayload.ownerId;
        current.custom_host_id = event.eventPayload.customHostId;
        current.bundles = [];
        current.deployments = [];

        const bundle: BundleRef = {
          kind: 'Template',
          value: {
            id: event.eventPayload.templateId,
          },
        };
        current.bundles.push(bundle);
        break;
      }

      case 'AppDeploymentCreated': {
        const newDeployment = event.eventPayload.deployment;

        const deployments = new Map(current.deployments);
        deployments.set(newDeployment.name, newDeployment);

        current.deployments = [...deployments.entries()];
        break;
      };

      case 'AppDeploymentDeleted': {
        const deployments = new Map(current.deployments);
        deployments.delete(event.eventPayload.deploymentName);

        current.deployments = [...deployments.entries()];
        break;
      };
    }
  }

  static bootstrapFromTemplate(props: {
    id: AppID,
    name: string,
    tenantId: string,
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
      eventName: 'AppCreatedFromTemplate',
      eventDate: Date.now(),
      eventPayload: {
        name: props.name,
        tenantId: props.tenantId,
        templateId: props.templateId,
        ownerId: props.ownerId,
        customHostId: props.customHostId,
      },
    });

    const bundle: BundleRef = {
      kind: 'Template',
      value: {
        id: props.templateId,
      },
    };

    const deployment = app.createDeployment({
      name: App.DEFAULT_DEPLOYMENT_NAME,
      bundle,
      customHostId: props.customHostId,
    });

    return { app, deployment };
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
      custom_host_id: props.customHostId,
      deployed_at: eventDate,
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
