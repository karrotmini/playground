import {
  AppIcon,
} from '../entities';
import {
  AppNameRequiredError,
  ReservedAppIdError,
} from '../errors';

export type AppManifestPayload = {
  appId: string,
  name: string,
  icon: string,
};

export class AppManifest {
  #appId: string;
  #name: string;
  #icon: AppIcon;

  get name() {
    return this.#name;
  }

  get appId() {
    return this.#appId;
  }

  get icon() {
    return this.#icon;
  }

  constructor(payload: AppManifestPayload) {
    AppManifest.validatePayload(payload);
    this.#appId = payload.appId;
    this.#name = payload.name;
    this.#icon = new AppIcon(payload.icon);
  }

  toJSON(): AppManifestPayload {
    return {
      appId: this.appId,
      name: this.name,
      icon: this.icon.toJSON(),
    };
  }

  static validatePayload(payload: AppManifestPayload) {
    AppManifest.validateAppId(payload.appId);
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
