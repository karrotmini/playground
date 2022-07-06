import {
  type HostnameProviderInfo,
} from '@karrotmini/playground-core/src/entities';

export type HostnameStatus = (
  | 'active'
  | 'pending_validation'
  | 'not_available'
);

// FIXME: 웹앱 컨트롤러 인터페이스로 기능 위임하기
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
