import {
  UserProfile,
  UserProfileID,
  type UserProfileSnapshot,
} from '@karrotmini/playground-core/src';
import {
  type IUserProfileRepository,
} from '@karrotmini/playground-application/src';

import {
  AggregatorProtocolClient,
} from '../base/DurableObjectAggregatorProtocol';
import * as Util from '../base/Util';

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
      UserProfileID(Util.generateShortId(13)),
    );
  }

  convertId(id: UserProfileID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: UserProfileID, snapshot?: UserProfileSnapshot): UserProfile {
    return new UserProfile(id, snapshot);
  }
}
