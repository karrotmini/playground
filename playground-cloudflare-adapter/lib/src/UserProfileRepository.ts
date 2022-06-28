import {
  UserProfile,
  UserProfileID,
  type UserProfileEvent,
  type IUserProfileRepository,
} from '@karrotmini/playground-core/src';

import {
  PlaygroundCloudflareAdapterClient,
} from '@karromtini/playground-cloudflare-adapter-transport/src/client';

export class UserProfileRepository
  implements IUserProfileRepository
{
  #client: PlaygroundCloudflareAdapterClient;

  constructor(config: {
    fetch: typeof fetch,
  }) {
    this.#client = new PlaygroundCloudflareAdapterClient({
      fetch: config.fetch,
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
