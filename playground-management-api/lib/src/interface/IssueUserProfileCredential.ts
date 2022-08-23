import {
  type ResourceId,
  type ResourceCredential,
} from './common';

export interface IPlaygroundManagementAPI {
  /**
   * 프로필 관리용 크레덴셜을 발급합니다.
   */
  issueUserProfileCredential<Permission extends 'READ' | 'WRITE' | 'ADMIN'>(
    input: IssueUserProfileCredentialInput<Permission>,
  ): Promise<IssueUserProfileCredentialResult<Permission>>;
}

export type IssueUserProfileCredentialInput<Permission extends 'READ' | 'WRITE' | 'ADMIN'> = {
  /**
   * 해당 리소스 ID
   * 리소스가 없으면 에러 throw
   */
  userProfileId: ResourceId,

  /**
   * 인가할 리소스 권한
   */
  permission: Array<Permission>,

  /**
   * minictl로 발급한 관리 키
   */
  managementKey: string,
};

export type IssueUserProfileCredentialResult<Permission extends 'READ' | 'WRITE' | 'ADMIN'> = {
  credential: ResourceCredential<'UserProfile', Permission>,
};

