import { type vi } from 'vitest';
import {
  type CustomHost,
} from '../../entities';
import {
  type ICustomHostRepository,
} from '../ports';
import {
  type SpyOf,
} from '../test/helpers';
import { VitestAggregator } from './VitestAggregator';

export class VitestCustomHostRepository
  extends VitestAggregator<CustomHost>
  implements ICustomHostRepository
{
  writeIndex: SpyOf<ICustomHostRepository, 'writeIndex'>;
  queryByHostname: SpyOf<ICustomHostRepository, 'queryByHostname'>;

  hostnameIndex: Map<string, CustomHost>;

  constructor(config: {
    vitestUtils: typeof vi,
    newId: () => string,
  }) {
    super(config);

    this.hostnameIndex = new Map();

    this.writeIndex = config.vitestUtils.fn();
    this.writeIndex.mockImplementation(async customHost => {
      if (customHost.hostname) {
        this.hostnameIndex.set(customHost.hostname, customHost);
      }
    });

    this.queryByHostname = config.vitestUtils.fn();
    this.queryByHostname.mockImplementation(async hostname => {
      return this.hostnameIndex.get(hostname) ?? null;
    });
  }
}
