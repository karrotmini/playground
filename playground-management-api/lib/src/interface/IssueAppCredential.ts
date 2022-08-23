import {
  type ResourceId,
  type ResourceCredential,
} from './common';

export interface IPlaygroundManagementAPI {
  /**
   * 앱 관리용 크레덴셜을 발급합니다.
   */
  issueAppCredential<Permission extends 'READ' | 'WRITE' | 'ADMIN'>(
    input: IssueAppCredentialInput<Permission>
  ): Promise<IssueAppCredentialResult<Permission>>;
}

export type IssueAppCredentialInput<Permission extends 'READ' | 'WRITE' | 'ADMIN'> = {
  /**
   * 해당 리소스 ID
   * 리소스가 없으면 에러 throw
   */
  appId: ResourceId,

  /**
   * 인가할 리소스 권한
   */
  permission: Array<Permission>,

  /**
   * minictl로 발급한 관리 키
   */
  managementKey: string,
};

export type IssueAppCredentialResult<Permission extends 'READ' | 'WRITE' | 'ADMIN'> = {
  credential: ResourceCredential<'App', Permission>,
};
