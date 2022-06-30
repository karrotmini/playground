import {
  UserProfile,
  UserProfileID,
  UserProfileEvent,
  IUserProfileRepository,
} from '@karrotmini/playground-core/src';

import {
  PlaygroundCloudflareAdapterClient,
  type ServiceBinding,
} from '@karromtini/playground-cloudflare-adapter-transport/src/client';

export class UserProfileRepository
  implements IUserProfileRepository
{
  #client: PlaygroundCloudflareAdapterClient;

  constructor(config: {
    service: ServiceBinding,
  }) {
    this.#client = new PlaygroundCloudflareAdapterClient({
      service: config.service,
    });
  }

  async newId(): Promise<UserProfileID> {
    const response = await this.#client.request({
      action: 'UserProfile_newID',
      payload: {},
    });
    return UserProfileID(response.id);
  }

  async aggregate(id: UserProfileID): Promise<UserProfile | null> {
    const response = await this.#client.request({
      action: 'UserProfile_aggregate',
      payload: {
        id,
      },
    });
    return response && new UserProfile(id, response.snapshot);
  }

  async commit(userProfile: UserProfile): Promise<UserProfileEvent[] | null> {
    const response = await this.#client.request({
      action: 'UserProfile_commit',
      payload: {
        id: userProfile.id,
        snapshot: userProfile.$snapshot,
        events: userProfile.$pullEvents(),
      },
    });
    return response.published;
  }
}
