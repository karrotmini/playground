import {
  AppNameRequiredError,
  ReservedAppIdError,
} from '../errors';

export type AppManifestPayload = {
  app_id: string,
  name: string,
};

export class AppManifest {
  #appId: string;
  #name: string;

  get name() {
    return this.#name;
  }

  get appId() {
    return this.#appId;
  }

  constructor(payload: AppManifestPayload) {
    AppManifest.validatePayload(payload);
    this.#appId = payload.app_id;
    this.#name = payload.name;
  }

  toJSON(): AppManifestPayload {
    return {
      app_id: this.appId,
      name: this.name,
    };
  }

  static validatePayload(payload: AppManifestPayload) {
    AppManifest.validateAppId(payload.app_id);
    AppManifest.validateAppName(payload.name);
  }

  static validateAppName(appName: string) {
    if (!appName) {
      throw new AppNameRequiredError();
    }
  }

  static validateAppId(appId: string): void {
    // 더 막을 거 있나...? 있으면 추가
    const blocklist = [
      'playground',
      'cli',
      'docs',
      'test',
      'daangn',
      'karrot',
      'karrotpay',
      'karrotmini',
      'karrotmarket',
    ];
    if (blocklist.includes(appId)) {
      throw new ReservedAppIdError(blocklist);
    }
  }
}
