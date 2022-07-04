import {
  CustomHost,
  CustomHostID,
  type CustomHostEvent,
} from '@karrotmini/playground-core/src';
import {
  type ICustomHostRepository,
} from '@karrotmini/playground-application/src';

import {
  PlaygroundCloudflareAdapterClient,
  type ServiceBinding,
} from '@karromtini/playground-cloudflare-adapter-transport/src/client';

export class CustomHostRepository
  implements ICustomHostRepository
{
  #client: PlaygroundCloudflareAdapterClient;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#client = new PlaygroundCloudflareAdapterClient({
      service: config.service,
    });
  }

  async newId(): Promise<CustomHostID> {
    const response = await this.#client.request({
      action: 'CustomHost_newID',
      payload: {},
    });
    return CustomHostID(response.id);
  }

  async aggregate(id: CustomHostID): Promise<CustomHost | null> {
    const response = await this.#client.request({
      action: 'CustomHost_aggregate',
      payload: {
        id,
      },
    });
    return response && new CustomHost(id, response.snapshot);
  }

  async commit(app: CustomHost): Promise<CustomHostEvent[] | null> {
    const response = await this.#client.request({
      action: 'CustomHost_commit',
      payload: {
        id: app.id,
        snapshot: app.$snapshot,
        events: app.$pullEvents(),
      },
    });
    return response && response.published;
  }

  async queryByHostname(hostname: string): Promise<CustomHost | null> {
    throw new Error('not implemented');
  }

  async writeIndex(customHost: CustomHost): Promise<void> {
    throw new Error('not implemented');
  }
}
