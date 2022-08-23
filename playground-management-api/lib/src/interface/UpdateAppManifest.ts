import {
  type ResourceId,
  type AppManifest,
} from './common';

export interface IPlaygroundManagementAPI {
  /**
   * 앱의 대표 매니페스트 정보를 변경합니다.
   * live 번들의 
   */
  updateAppManifest(
    input: UpdateAppManifestInput,
  ): Promise<UpdateAppManifestResult>;
}

export type UpdateAppManifestInput = {
  /**
   * 테넌트 앱의 ID
   */
  appId: ResourceId,

  /**
   * 매니페스트 정보
   */
  manifest: AppManifest,
};

export type UpdateAppManifestResult = {
  /**
   * 패키지 내부에 
   */
  updated: boolean,

  /**
   * app_id 입력에 따라 대표 주소가 변경될 수 있습니다.
   */
  hostname: string,

  /**
   * 번들 내에 유효한 mini.json 파일이 포함된 경우 해당 내용이,
   * 존재하지 않는 경우 입력한 값이 리턴됩니다.
   */
  manifest: AppManifest,
};
