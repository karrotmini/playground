import {
  BundleUpload,
  BundleUploadID,
  type BundleUploadEvent,
} from '@karrotmini/playground-core/src';
import {
  type IBundleUploadRepository,
} from '@karrotmini/playground-application/src';

import {
  PlaygroundCloudflareAdapterClient,
  type ServiceBinding,
} from '@karromtini/playground-cloudflare-adapter-transport/src/client';

export class BundleUploadRepository
  implements IBundleUploadRepository
{
  #client: PlaygroundCloudflareAdapterClient;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#client = new PlaygroundCloudflareAdapterClient({
      service: config.service,
    });
  }

  async newId(): Promise<BundleUploadID> {
    const response = await this.#client.request({
      action: 'BundleUpload_newID',
      payload: {},
    });
    return BundleUploadID(response.id);
  }

  async aggregate(id: BundleUploadID): Promise<BundleUpload | null> {
    const response = await this.#client.request({
      action: 'BundleUpload_aggregate',
      payload: {
        id,
      },
    });
    return response && new BundleUpload(id, response.snapshot);
  }

  async commit(app: BundleUpload): Promise<BundleUploadEvent[] | null> {
    const response = await this.#client.request({
      action: 'BundleUpload_commit',
      payload: {
        id: app.id,
        snapshot: app.$snapshot,
        events: app.$pullEvents(),
      },
    });
    return response.published;
  }
}
