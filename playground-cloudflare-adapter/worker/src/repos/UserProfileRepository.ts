import {
  UserProfile,
  UserProfileID,
  type UserProfileSnapshot,
  Utils,
} from '@karrotmini/playground-core/src';
import {
  type IUserProfileRepository,
} from '@karrotmini/playground-application/src';

import {
  AggregatorProtocolClient,
} from '../base/DurableObjectAggregatorProtocol';

export class UserProfileRepository
  extends AggregatorProtocolClient<UserProfile>
  implements IUserProfileRepository
{
  #namespace: DurableObjectNamespace;
  #seq: Generator<string>;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    super(config);
    this.#namespace = config.namespace;
    this.#seq = Utils.shortId(Math.random, 13);
  }

  newId(): Promise<UserProfileID> {
    const id = this.#seq.next().value;
    return Promise.resolve(UserProfileID(id));
  }

  convertId(id: UserProfileID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: UserProfileID, snapshot?: UserProfileSnapshot): UserProfile {
    return new UserProfile(id, snapshot);
  }
}
