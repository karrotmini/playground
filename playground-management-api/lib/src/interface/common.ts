import {
  type AppManifestPayload,
} from '@karrotmini/playground-core/src/entities/AppManifest';

export type AppManifest = AppManifestPayload;

/**
 * 서비스에서 발급한 크레덴셜 문자열
 */
export type ResourceCredential<
  RequireResource extends string,
  RequirePermission extends string
> = string & (
  & { __ISSUER__: '@karrotmini/playground-management-api' }
  & { __BRAND__: 'ResourceCredential' }
  & { __REQUIRE__: [RequireResource, RequirePermission] }
);

/**
 * Playground 서비스 리소스의 고유 UI
 */
export type ResourceId = string & (
  & { __ISSUER__: '@karrotmini/playground-management-api' }
  & { __BRAND__: 'ResourceId' }
);


