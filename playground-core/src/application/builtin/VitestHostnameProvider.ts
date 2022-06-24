import { type vi } from 'vitest';
import {
  type IHostnameProvider,
} from '../ports';
import {
  type SpyOf,
} from '../_test';

export class VitestHostnameProvider implements IHostnameProvider {
  searchHostname: SpyOf<IHostnameProvider, 'searchHostname'>;
  createHostname: SpyOf<IHostnameProvider, 'createHostname'>;
  checkStatus: SpyOf<IHostnameProvider, 'checkStatus'>;

  constructor(config: {
    vitestUtils: typeof vi,
  }) {
    this.searchHostname = config.vitestUtils.fn();
    this.createHostname = config.vitestUtils.fn();
    this.checkStatus = config.vitestUtils.fn();
  }
}
