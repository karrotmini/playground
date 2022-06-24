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
  type CustomHostDeletedEvent,
} from '../events';
import {
  HostnameProviderInfo,
  type AppID,
  type HostnameProviderInfoPayload,
} from '../entities';

export type CustomHostID = GUID<'CustomHost'>;
export const CustomHostID = registerGUID<CustomHostID>();

export type CustomHostEvent = (
  | CustomHostProvisionedEvent
  | CustomHostDeletedEvent
  | CustomHostConnectedEvent
  | CustomHostDisconnectedEvent
);

export type CustomHostSnapshot = Snapshot<1, {
  createdAt: number,
  deletedAt: number | null,
  connectedAppId: AppID | null,
  providerInfo: HostnameProviderInfoPayload,
}>;
export const CustomHostSnapshot = registerSnapshot<CustomHostSnapshot>();

export type CustomHostDTO = {
  id: string,
  connectedAppId: AppID | null,
  providerInfo: HostnameProviderInfoPayload | null,
  isDeleted: boolean,
};

export class CustomHost
  extends Aggregate<CustomHostID, CustomHostEvent, CustomHostSnapshot, CustomHostDTO>
{
  readonly typename = 'CustomHost' as const;
  readonly snapshotVersion = 1 as const;

  get connectedAppId() {
    return this.$snapshot.connectedAppId;
  }

  get providerInfo() {
    return this.$snapshot.providerInfo && new HostnameProviderInfo(this.$snapshot.providerInfo);
  }

  get hostname() {
    return this.providerInfo?.hostname || null;
  }

  get healthCheckUrl() {
    return this.providerInfo?.healthCheckUrl
      ? new URL(this.providerInfo.healthCheckUrl)
      : null;
  }

  get managementUrl() {
    return this.providerInfo?.managementUrl
      ? new URL(this.providerInfo.managementUrl)
      : null;
  }

  get url() {
    return this.hostname
      ? new URL(`https://${this.hostname}`)
      : null;
  }

  get isDeleted() {
    return this.$snapshot.deletedAt != null;
  }

  toJSON(): CustomHostDTO {
    return Object.freeze({
      id: this.id,
      connectedAppId: this.connectedAppId,
      providerInfo: this.providerInfo?.toJSON() ?? null,
      isDeleted: this.isDeleted,
    });
  }

  validate(state: Partial<CustomHostSnapshot>): state is CustomHostSnapshot {
    if (!(
      ('providerInfo' in state) &&
      (state.connectedAppId === null || typeof state.connectedAppId === 'string') &&
      typeof state.createdAt === 'number' &&
      (state.deletedAt === null || typeof state.deletedAt === 'number')
    )) {
      return false;
    }

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
        current.connectedAppId = null;
        current.deletedAt = null;
        break;
      }
      case 'CustomHostDisconnected': {
        current.connectedAppId = null;
        break;
      }
      case 'CustomHostConnected': {
        current.connectedAppId = event.eventPayload.appId;
        break;
      }
      case 'CustomHostDeleted': {
        current.deletedAt = event.eventDate;
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
  }) {
    if (this.connectedAppId) {
      this.disconnect();
    }

    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'CustomHostConnected',
      eventDate: Date.now(),
      eventPayload: {
        appId: props.appId,
        customHostId: this.id,
      },
    });
  }

  disconnect() {
    if (this.connectedAppId) {
      this.$publishEvent({
        aggregateName: this.typename,
        aggregateId: this.id,
        eventName: 'CustomHostDisconnected',
        eventDate: Date.now(),
        eventPayload: {
          appId: this.connectedAppId,
          customHostId: this.id,
        },
      });
    }
  }

  delete() {
    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'CustomHostDeleted',
      eventDate: Date.now(),
      eventPayload: {
        customHostId: this.id,
      },
    });
  }
}
