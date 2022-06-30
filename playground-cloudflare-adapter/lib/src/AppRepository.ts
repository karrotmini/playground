import {
  App,
  AppEvent,
  AppID,
  AppSnapshot,
  IAppRepository,
} from '@karrotmini/playground-core/src';

import {
  PlaygroundCloudflareAdapterClient,
  type ServiceBinding,
} from '@karromtini/playground-cloudflare-adapter-transport/src/client';

export class AppRepository
  implements IAppRepository
{
  #client: PlaygroundCloudflareAdapterClient;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#client = new PlaygroundCloudflareAdapterClient({
      service: config.service,
    });
  }

  async newId(): Promise<AppID> {
    const response = await this.#client.request({
      action: 'App_newID',
      payload: {},
    });
    return AppID(response.id);
  }

  async aggregate(id: AppID): Promise<App | null> {
    const response = await this.#client.request({
      action: 'App_aggregate',
      payload: {
        id,
      },
    });
    return response && new App(id, response.snapshot);
  }

  async commit(app: App): Promise<AppEvent[] | null> {
    const response = await this.#client.request({
      action: 'App_commit',
      payload: {
        id: app.id,
        snapshot: app.$snapshot,
        events: app.$pullEvents(),
      },
    });
    return response.published;
  }
}
