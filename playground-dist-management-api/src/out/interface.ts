/**
 * 서비스에서 발급한 크레덴셜 문자열
 */
export type ResourceCredential<
  RequireResource extends string,
  RequirePermission extends string
> = string & (
  & { __ISSUER__: 'Karrotmini Playground' }
  & { __BRAND__: 'ResourceCredential' }
  & { __REQUIRE__: [RequireResource, RequirePermission] }
);

/**
 * Playground 서비스 리소스의 고유 UI
 */
export type ResourceId = string & (
  & { __ISSUER__: 'Karrotmini Playground' }
  & { __BRAND__: 'ResourceId' }
);

/**
 * App Manifest 정보
 * 사용자가 입력하는 App의 속성들만 포함 합니다.
 */
export type AppManifest = {
  /**
   * 사용자가 선택한 식별자로 앱 도메인이거나 앱 도메인 세그먼트입니다. (`*.karrotmini.app`인 경우)
   *
   * 주의: 리소스 ID와는 다른 값 입니다.
   */
  appId: string,

  /**
   * 사용자가 입력한 앱 이름. 한 글자보다 커야합니다.
   */
  name: string,

  /**
   * 사용자가 입력한 아이콘 파일 상대경로
   *
   * 주의: 실제 URL과 다른 값 입니다.
   */
  icon?: string,
};

export interface IPlaygroundManagementAPI {
  /**
   * UserProfile 관리용 크레덴셜을 발급합니다.
   */
  issueUserProfileCredential<Permission extends 'read' | 'write'>(
    input: IssueUserProfileCredentialInput<Permission>,
  ): Promise<IssueUserProfileCredentialResult<Permission>>;
}

export type IssueUserProfileCredentialInput<Permission extends 'read' | 'write'> = {
  /**
   * 인가할 리소스 권한
   */
  permission: Array<Permission>,

  /**
   * minictl로 발급한 관리 키
   */
  managementKey: string,

  /**
   * 리소스 ID
   * - 전달한 리소스 ID가 유효하지 않은 경우 Error throw
   * - 전달한 리소스 ID가 없는 경우 새로 생성됨
   */
  userProfileId?: ResourceId,
};

export type IssueUserProfileCredentialResult<Permission extends 'read' | 'write'> = {
  credential: ResourceCredential<'UserProfile', Permission>,
  userProfileId: ResourceId,
};


export interface IPlaygroundManagementAPI {
  /**
   * 앱 관리용 크레덴셜을 발급합니다.
   */
  issueAppCredential<Permission extends 'read' | 'write' | 'admin'>(
    input: IssueAppCredentialInput<Permission>
  ): Promise<IssueAppCredentialResult<Permission>>;
}

export type IssueAppCredentialInput<Permission extends 'read' | 'write' | 'admin'> = {
  /**
   * 인가할 리소스 권한
   */
  permission: Array<Permission>,

  /**
   * minictl로 발급한 관리 키
   */
  managementKey: string,

  /**
   * 리소스 ID
   * - 전달한 리소스 ID가 유효하지 않은 경우 Error throw
   * - 전달한 리소스 ID가 없는 경우 새로 생성됨
   */
  appId?: ResourceId,
};

export type IssueAppCredentialResult<Permission extends 'read' | 'write' | 'admin'> = {
  credential: ResourceCredential<'App', Permission>,
  appId: ResourceId,
};


export interface IPlaygroundManagementAPI {
  /**
  * App의 공개 정보를 가져옵니다.
  */
  fetchAppInfo(
    input: FetchAppInfoInput,
  ): Promise<FetchAppInfoResult>;
}

export type FetchAppInfoInput = {
  /**
   * read 권한 필요 
   */
  credential: ResourceCredential<'App', 'read'>,
};

export type FetchAppInfoResult = {
  /**
   * 이 API의 주소
   */
  appInfoUrl: URL,

  /**
   * 해당 앱의 번들 다운로드 공개 주소
   */
  appDownloadUrl: URL,

  /**
   * 해당 앱의 아이콘 이미지 공개 주소
   */
  iconUrl: URL,

  /**
   * 해당 앱의 현재 호스트명
   */
  hostname: string,

  /**
   * 해당 앱의 현재 매니페스트
   */
  manifest: AppManifest,
};


export interface IPlaygroundManagementAPI {
  /**
  * 앱의 매니페스트를 업데이트 합니다.
  * 앱 번들에 매니페스트 파일이 포함되어 있는 경우 무시합니다.
  */
  updateAppManifest(
    input: UpdateAppManifestInput,
  ): Promise<UpdateAppManifestResult>;
}

export type UpdateAppManifestInput = {
  credential: ResourceCredential<'App', 'admin'>,
  manifest: AppManifest,
};

export type UpdateAppManifestResult = {
  manifest: AppManifest,
};


export interface IPlaygroundManagementAPI {
  /**
  * 앱 번들을 업로드합니다.
  */
  updateAppBundle(input: UpdateAppBundleInput): Promise<UpdateAppBundleResult>;
}

export type UpdateAppBundleInput = {
  credential: ResourceCredential<'App', 'AppBundle'>;

  /**
   * AppBundle 컨텐츠 (ZIP archive)
   */
  content: ReadableStream,

  /**
   * AppBundle 태그 문자열 (alphanumeric)
   */
  tag: string,

  /**
   * 앱 매니페스트 fallback
   * content 내에 사용 가능한 매니페스트가 포함된 경우 무시합니다.
   */
  manifest: AppManifest,

  /**
   * 아이콘 업로드
   * content 내에 사용 가능한 아이콘이 포함된 경우 무시합니다.
   * Note: 웹에서 다운로드 가능한 퍼블릭 URL이여야 합니다.
   */
  iconUrl?: URL,
};

export type UpdateAppBundleResult = {
  manifest: AppManifest,
  hostname: string,
  tag: string,
};
