import {
  UserProfile,
  UserProfileID,
} from '@karrotmini/playground-core/src';

import type {
  ServiceBinding,
  RequestMessage,
  ResponseMessage,
} from './types';

export * from './types';

export class PlaygroundCloudflareAdapterServiceError extends Error {
}

export class PlaygroundCloudflareAdapterTransportError extends Error {
}

export class PlaygroundCloudflareAdapterClient {
  #service: ServiceBinding;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#service = config.service;
  }

  async UserProfile_newID() {
    const response = await this.#request({
      action: 'UserProfile_newID',
      payload: {},
    });
    return UserProfileID(response.id);
  }

  async UserProfile_aggregate(id: UserProfileID) {
    const response = await this.#request({
      action: 'UserProfile_aggregate',
      payload: {
        id,
      },
    });
    return response && new UserProfile(id, response.snapshot);
  }

  async UserProfile_commit(userProfile: UserProfile) {
    const response = await this.#request({
      action: 'UserProfile_commit',
      payload: {
        id: userProfile.id,
        snapshot: userProfile.$snapshot,
        events: userProfile.$pullEvents(),
      },
    });
    return response.published;
  }

  async #request<T extends RequestMessage>(
    message: T,
  ): Promise<Extract<ResponseMessage, {
    success: true,
    action: T['action']
  }>['result']> {
    const url = new URL('http://playground-cloudflare-adapter');
    const request = new Request(url, {
      body: JSON.stringify(message),
    });

    let response: ResponseMessage;
    try {
      const res = await this.#service.fetch(request);
      response = await res.json() as ResponseMessage;
    } catch (e: any) {
      throw new PlaygroundCloudflareAdapterTransportError(
        e.message || e.toString(),
      );
    }

    if (!response.success) {
      throw new PlaygroundCloudflareAdapterServiceError(response.message);
    }

    return response.result as any;
  }
}
