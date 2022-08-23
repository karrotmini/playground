import {
  type ResourceId,
  type AppManifest,
} from './common';

export interface IPlaygroundManagementAPI {
  /**
   * 앱 리소스를 생성합니다.
   */
  createApp(
    input: CreateAppInput,
  ): Promise<CreateAppResult>;
}

export type CreateAppInput = {
  /**
   * 초기 오너십 프로필의 ID
   * null 인 경우 오너십 없는 앱이 만들어지며 프로필을 통해 접근할 수 없음
   */
  userProfileId: ResourceId | null,

  /*
   * 앱 초기 manifest 정보
   * - name: string (필수)
   * - app_id: string (필수)
   */
  manifest: AppManifest,

  /**
   * minictl 관리 키
   */
  managementKey: string,
};

export type CreateAppResult = {
  appId: ResourceId,
};
