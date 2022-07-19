import { type vi } from 'vitest';
import {
  type IBundleStorage,
} from '../ports';
import {
  type SpyOf,
} from '../test/helpers';

export class VitestBundleStorage implements IBundleStorage {
  connectBundleHost: SpyOf<IBundleStorage, 'connectBundleHost'>;
  uploadBundleContent: SpyOf<IBundleStorage, 'uploadBundleContent'>;

  constructor(config: {
    vitestUtils: typeof vi,
  }) {
    this.connectBundleHost = config.vitestUtils.fn();
    this.uploadBundleContent = config.vitestUtils.fn();
  }
}
