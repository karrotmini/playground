import {
  HostnameProviderInfo,
  type HostnameStatus,
  type IHostnameProvider,
} from '@karrotmini/playground-core/src';

export class CloudflareHostnameProvider
  implements IHostnameProvider
{
  checkStatus(props: {
    providerInfo: HostnameProviderInfo,
  }): Promise<HostnameStatus> {
    throw new Error('not implemented');
  }

  searchHostname(props: {
    hostname: string,
  }): Promise<HostnameProviderInfo | null> {
    throw new Error('not implemented');
  }

  createHostname(props: {
    hostname: string,
  }): Promise<HostnameProviderInfo | null> {
    throw new Error('not implemented');
  }
}
