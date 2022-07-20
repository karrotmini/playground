import {
  type Bundle,
  type CustomHost,
} from '@karrotmini/playground-core/src';
import {
  type IBundleStorage,
} from '@karrotmini/playground-application/src';

export class PlaygroundBundleStorage
  implements IBundleStorage
{
  #service: ServiceBinding;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#service = config.service;
  }

  async connectBundleHost(props: {
    bundle: Bundle,
    customHost: CustomHost,
  }): Promise<void> {
    const url = new URL('http://playground');
    url.pathname = `/bundle/${props.bundle.id}/connect_hostname`;

    const form = new FormData();
    form.set('hostname', props.customHost.hostname);

    const response = await this.#service.fetch(url, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    // FIXME: Error handling
  }

  async uploadBundleContent(props: {
    bundle: Bundle,
    content: ReadableStream<any>,
  }): Promise<void> {
   const url = new URL('http://playground');
    url.pathname = `/bundle/${props.bundle.id}/connect_hostname`;

    const form = new FormData();
    const file = new File([], props.bundle.id + '.zip');
    form.set('file', file);

    const response = await this.#service.fetch(url, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    // FIXME: Error handling
  }
}
