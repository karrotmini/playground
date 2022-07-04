import { type vi } from 'vitest';
import {
  type IAppBundleStorage,
} from '../ports';
import {
  type SpyOf,
} from '../test/helpers';

export class VitestAppBundleStorage implements IAppBundleStorage {
  writeIndex: SpyOf<IAppBundleStorage, 'writeIndex'>;
  uploadContent: SpyOf<IAppBundleStorage, 'uploadContent'>;

  constructor(config: {
    vitestUtils: typeof vi,
  }) {
    this.writeIndex = config.vitestUtils.fn();
    this.uploadContent = config.vitestUtils.fn();
  }
}
