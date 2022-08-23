import {
  type ResourceId,
  type AppManifest,
} from './common';

export interface IPlaygroundManagementAPI {
  uploadAppBundle(
    input: UploadAppBundleInput,
  ): Promise<UploadAppBundleResult>;
}

export type UploadAppBundleInput = {
  /**
   * 테넌트 앱의 ID
   */
  appId: ResourceId,

  /**
   * 컨텐츠 blob 파일
   * 반드시 유효한 miniapp package format (현재는 ZIP만 지원) 이여야 합니다.
   */
  content: Blob,

  /**
   * 지정하는 경우 배포가 바로 생성됩니다
   * "live" 는 예약된 deployment name 이고, 지정하면 바로 사이트에 반영됩니다
   * 나머지 이름은 {deploymentName}.{appId}.karrotmini.app 으로 배포됩니다.
   *
   * 배포가 지정되지 않는 경우 이후 bundleId 를 통해
   */
  deploymentName: string | null,

  /**
   * 패키지 내부에 mini.json 이 포함되어 있지 않는 경우 사용되는 매니페스트 정보입니다.
   */
  manifestFallback: AppManifest,

  /**
   * 번들에 임의의 태그를 지정할 수 있습니다.
   * 빈 문자열은 무시됩니다.
   */
  tag: string | null,
};

export type UploadAppBundleResult = {
  /**
   * 번들 내에 유효한 mini.json 파일이 포함된 경우 반환됩니다.
   * 없어도 되지만 존재하는 경우 반드시 유효해야하며,
   * 존재하는 경우 입력한 manifestFallback 값은 무시됩니다.
   */
  manifest: AppManifest | null,

  /**
   * 생성된 번들의 리소스 ID
   */
  bundleId: ResourceId,
};
