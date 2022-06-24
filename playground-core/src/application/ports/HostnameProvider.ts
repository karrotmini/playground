import {
  type HostnameProviderInfo,
} from '../../entities';

export type HostnameStatus = (
  | 'active'
  | 'pending_validation'
  | 'not_available'
);

export interface IHostnameProvider {
  searchHostname(props: {
    hostname: string,
  }): Promise<HostnameProviderInfo | null>;

  createHostname(props: {
    hostname: string,
  }): Promise<HostnameProviderInfo | null>;

  checkStatus(props: {
    providerInfo: HostnameProviderInfo,
  }): Promise<HostnameStatus>;
}
