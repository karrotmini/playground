import {
  HostnameProviderInfo,
  type HostnameStatus,
  type IHostnameProvider,
} from '@karrotmini/playground-core/src';

export class CloudflareHostnameProvider
  implements IHostnameProvider
{
  static API_ENDPOINT = 'https://api.cloudflare.com/client/v4';

  #baseUrl: URL;
  #fetch: typeof fetch;
  #apiToken: string;
  #zoneId: string;

  constructor(config: {
    baseUrl?: URL,
    fetch: typeof fetch,
    apiToken: string,
    zoneId: string,
  }) {
    this.#baseUrl = config.baseUrl ?? new URL(CloudflareHostnameProvider.API_ENDPOINT);
    this.#fetch = config.fetch;
    this.#apiToken = config.apiToken;
    this.#zoneId = config.zoneId;
  }

  async checkStatus(props: {
    providerInfo: HostnameProviderInfo,
  }): Promise<HostnameStatus> {
    const endpoint = props.providerInfo.healthCheckUrl;

    const response = await this.#fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#apiToken}`,
      },
    });

    const data = await response.json<{
      success: boolean,
      errors: [],
      messages: string[],
      result: {
        id: string,
        hostname: string,
        ssl: {
          status: string,
        },
      },
    }>();

    if (!data.success) {
      // FIXME: Make error class
      throw new Error(data.messages.join('\n'));
    }

    switch (data.result.ssl.status) {
      case 'active':
      case 'pending_validation':
        return data.result.ssl.status;
      default:
        return 'not_available';
    }
  }

  async searchHostname(props: {
    hostname: string,
  }): Promise<HostnameProviderInfo | null> {
    const baseUrl = new URL(this.#baseUrl);
    baseUrl.pathname = `/zones/${this.#zoneId}/custom_hostnames`;

    const endpoint = new URL(baseUrl);
    endpoint.searchParams.set('hostname', props.hostname);

    const response = await this.#fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#apiToken}`,
      },
    });

    const data = await response.json<{
      success: boolean,
      errors: [],
      messages: string[],
      result: Array<{
        id: string,
        hostname: string,
        ssl: {
          id: string,
          status: 'pending_validation',
          method: 'http',
          type: 'dv',
        },
      }>,
    }>();

    if (!data.success) {
      // FIXME: Make error class
      throw new Error(data.messages.join('\n'));
    }

    const [result] = data.result;
    if (result) {
      return new HostnameProviderInfo({
        hostname: result.hostname,
        healthCheckUrl: `${baseUrl}/${result.id}`,
        managementUrl: `${baseUrl}/${result.id}`,
      });
    }

    return null;
  }

  async createHostname(props: {
    hostname: string,
  }): Promise<HostnameProviderInfo | null> {
    const baseUrl = new URL(this.#baseUrl);
    baseUrl.pathname = `/zones/${this.#zoneId}/custom_hostnames`;

    const endpoint = new URL(baseUrl);

    const response = await this.#fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#apiToken}`,
      },
      body: JSON.stringify({
        hostname: props.hostname,
        ssl: {
          type: 'dv',
          method: 'http',
          settings: {
            http2: 'on',
            min_tls_version: '1.2',
            tls_1_3: 'on',
          },
        },
      }),
    });

    const data = await response.json<{
      success: boolean,
      errors: [],
      messages: string[],
      result: {
        id: string,
        hostname: string,
        ssl: {
          id: string,
          status: 'pending_validation',
          method: 'http',
          type: 'dv',
        },
      },
    }>();

    if (!data.success) {
      // FIXME: Make error class
      throw new Error(data.messages.join('\n'));
    }

    return new HostnameProviderInfo({
      hostname: data.result.hostname,
      healthCheckUrl: `${baseUrl}/${data.result.id}`,
      managementUrl: `${baseUrl}/${data.result.id}`,
    });
  }
}
