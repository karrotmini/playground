import type {
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

  newId(): Promise<UserProfileID> {
    return this.#client.UserProfile_newID();
  }

  aggregate(id: UserProfileID): Promise<UserProfile | null> {
    return this.#client.UserProfile_aggregate(id);
  }

  commit(userProfile: UserProfile): Promise<UserProfileEvent[] | null> {
    return this.#client.UserProfile_commit(userProfile);
  }
}
