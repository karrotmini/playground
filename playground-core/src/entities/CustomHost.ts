import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Snapshot,
} from '../framework';
import {
  type CustomHostProvisionedEvent,
  type CustomHostConnectedEvent,
  type CustomHostDisconnectedEvent,
} from '../events';
import {
  HostnameProviderInfo,
  type AppID,
  type HostnameProviderInfoPayload,
} from '../entities';

export type CustomHostID = GUID<'CustomHost'>;
export const CustomHostID = registerGUID<CustomHostID>();

type CustomHostAppConnection = {
  id: AppID,
  deploymentName: string,
};

export type CustomHostSnapshot = Snapshot<1, {
  createdAt: number,
  providerInfo: HostnameProviderInfoPayload,
  connectedApp: CustomHostAppConnection | null,
}>;
export const CustomHostSnapshot = registerSnapshot<CustomHostSnapshot>();

export type CustomHostEvent = (
  | CustomHostProvisionedEvent
  | CustomHostConnectedEvent
  | CustomHostDisconnectedEvent
);

export type CustomHostDTO = {
  id: string,
  providerInfo: HostnameProviderInfoPayload,
  connectedApp: CustomHostAppConnection | null,
};

export class CustomHost
  extends Aggregate<CustomHostID, CustomHostEvent, CustomHostSnapshot, CustomHostDTO>
{
  readonly typename = 'CustomHost' as const;
  readonly snapshotVersion = 1 as const;

  get connectedApp() {
    return this.$snapshot.connectedApp;
  }

  get providerInfo() {
    return new HostnameProviderInfo(this.$snapshot.providerInfo);
  }

  get hostname() {
    return this.providerInfo.hostname;
  }

  get healthCheckUrl() {
    return this.providerInfo.healthCheckUrl;
  }

  get managementUrl() {
    return this.providerInfo.managementUrl;
  }

  get url() {
    return new URL(`https://${this.hostname}`);
  }

  toJSON(): Readonly<CustomHostDTO> {
    return Object.freeze({
      id: this.id,
      providerInfo: this.providerInfo.toJSON(),
      connectedApp: this.connectedApp,
    });
  }

  validate(state: Partial<CustomHostSnapshot>): state is CustomHostSnapshot {
    if (state.providerInfo) {
      new HostnameProviderInfo(state.providerInfo);
    }

    return true;
  }

  reduce(current: CustomHostSnapshot, event: CustomHostEvent): void {
    switch (event.eventName) {
      case 'CustomHostProvisioned': {
        current.createdAt = event.eventDate;
        current.providerInfo = event.eventPayload.providerInfo;
        current.connectedApp = null;
        break;
      }
      case 'CustomHostDisconnected': {
        current.connectedApp = null;
        break;
      }
      case 'CustomHostConnected': {
        current.connectedApp = {
          id: event.eventPayload.appId,
          deploymentName: event.eventPayload.deploymentName,
        };
        break;
      }
    }
  }

  static createWithProviderInfo(props: {
    id: CustomHostID,
    providerInfo: HostnameProviderInfo,
  }) {
    const id = props.id;
    const customHost = new CustomHost(id);
    customHost.$publishEvent({
      aggregateName: customHost.typename,
      aggregateId: id,
      eventName: 'CustomHostProvisioned',
      eventDate: Date.now(),
      eventPayload: {
        providerInfo: props.providerInfo.toJSON(),
      },
    });

    return customHost;
  }

  connect(props: {
    appId: AppID,
    deploymentName: string,
  }) {
    if (this.connectedApp) {
      this.disconnect();
    }

    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'CustomHostConnected',
      eventDate: Date.now(),
      eventPayload: {
        appId: props.appId,
        deploymentName: props.deploymentName,
      },
    });
  }

  disconnect() {
    if (this.connectedApp) {
      this.$publishEvent({
        aggregateName: this.typename,
        aggregateId: this.id,
        eventName: 'CustomHostDisconnected',
        eventDate: Date.now(),
        eventPayload: {
          appId: this.connectedApp.id,
        },
      });
    }
  }
}
