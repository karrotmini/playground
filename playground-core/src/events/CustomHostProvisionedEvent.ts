import {
  type DomainEvent,
} from '../framework';
import {
  type HostnameProviderInfoPayload,
} from '../entities';

export type CustomHostProvisionedEvent = DomainEvent<'CustomHost', 'CustomHostProvisioned', {
  providerInfo: HostnameProviderInfoPayload,
}>;
