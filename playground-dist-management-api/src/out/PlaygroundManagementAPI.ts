import type {
  IssueUserProfileCredentialInput,
  IssueUserProfileCredentialResult,
  IPlaygroundManagementAPI,
  IssueAppCredentialInput,
  IssueAppCredentialResult,
  FetchAppInfoInput,
  FetchAppInfoResult,
  UpdateAppManifestInput,
  UpdateAppManifestResult,
  UpdateAppBundleInput,
  UpdateAppBundleResult,
} from './interface.js';

export class PlaygroundManagementAPI implements IPlaygroundManagementAPI {
  #baseUrl: URL;
  #fetch: typeof fetch;

  constructor(config: {
    baseUrl: URL,
    fetch: typeof fetch;
  }) {
    this.#baseUrl = config.baseUrl;
    this.#fetch = config.fetch;
  }

  issueUserProfileCredential<Permission extends 'read' | 'write'>(
    input: IssueUserProfileCredentialInput<Permission>
  ): Promise<IssueUserProfileCredentialResult<Permission>> {
    throw new Error('not implemented');
  }

  issueAppCredential<Permission extends 'read' | 'write' | 'admin'>(
    input: IssueAppCredentialInput<Permission>,
  ): Promise<IssueAppCredentialResult<Permission>> {
    throw new Error('not implemented');
  }

  fetchAppInfo(
    input: FetchAppInfoInput
  ): Promise<FetchAppInfoResult> {
    throw new Error('not implemented');
  }

  updateAppManifest(
    input: UpdateAppManifestInput,
  ): Promise<UpdateAppManifestResult> {
    throw new Error('not implemented');
  }

  updateAppBundle(
    input: UpdateAppBundleInput,
  ): Promise<UpdateAppBundleResult> {
    throw new Error('not implemented');
  }
}
