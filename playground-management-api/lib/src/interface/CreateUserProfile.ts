import {
  type ResourceId,
} from './common';

export interface IPlaygroundManagementAPI {
  /**
   * 프로필 리소스를 생성합니다.
   */
  createUserProfile(
    input: CreateUserProfileInput,
  ): Promise<CreateUserProfileResult>;
}

export type CreateUserProfileInput = {
  /**
   * display name
   */
  name: string,

  /**
   * minictl 관리 키
   */
  managementKey: string,
};

export type CreateUserProfileResult = {
  userProfileId: ResourceId,
};
