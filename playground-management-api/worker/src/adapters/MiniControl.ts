export class MiniControl {
  #service: ServiceBinding;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#service = config.service;
  }

  async validateManagementKey(key: string): Promise<boolean> {
    const url = new URL('http://playground-management-api');
    url.pathname = '/management_key';

    const response = await this.#service.fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const upstreamKey = await response.text();
    return key === upstreamKey;
  }
}
