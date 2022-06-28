import {
  UserProfile,
  UserProfileID,
  type UserProfileSnapshot,
  type IUserProfileRepository,
} from '@karrotmini/playground-core/src';
import {
  AggregatorProtocolClient,
} from './base/protocol';
import * as Utils from './base/utils';

export class UserProfileRepository
  extends AggregatorProtocolClient<UserProfile>
  implements IUserProfileRepository
{
  #namespace: DurableObjectNamespace;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    super(config);
    this.#namespace = config.namespace;
  }

  newId(): Promise<UserProfileID> {
    return Promise.resolve(
      UserProfileID(Utils.generateShortId(13)),
    );
  }

  convertId(id: UserProfileID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: UserProfileID, snapshot?: UserProfileSnapshot): UserProfile {
    return new UserProfile(id, snapshot);
  }
}
