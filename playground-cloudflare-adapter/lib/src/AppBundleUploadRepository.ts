import {
  AppBundleUpload,
  AppBundleUploadID,
  type AppBundleUploadEvent,
  type IAppBundleUploadRepository,
} from '@karrotmini/playground-core/src';

import {
  PlaygroundCloudflareAdapterClient,
  type ServiceBinding,
} from '@karromtini/playground-cloudflare-adapter-transport/src/client';

export class AppBundleUploadRepository
  implements IAppBundleUploadRepository
{
  #client: PlaygroundCloudflareAdapterClient;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#client = new PlaygroundCloudflareAdapterClient({
      service: config.service,
    });
  }

  async newId(): Promise<AppBundleUploadID> {
    const response = await this.#client.request({
      action: 'AppBundleUpload_newID',
      payload: {},
    });
    return AppBundleUploadID(response.id);
  }

  async aggregate(id: AppBundleUploadID): Promise<AppBundleUpload | null> {
    const response = await this.#client.request({
      action: 'AppBundleUpload_aggregate',
      payload: {
        id,
      },
    });
    return response && new AppBundleUpload(id, response.snapshot);
  }

  async commit(app: AppBundleUpload): Promise<AppBundleUploadEvent[] | null> {
    const response = await this.#client.request({
      action: 'AppBundleUpload_commit',
      payload: {
        id: app.id,
        snapshot: app.$snapshot,
        events: app.$pullEvents(),
      },
    });
    return response.published;
  }
}
