import {
  UserProfile,
  UserProfileID,
  type UserProfileSnapshot,
} from '@karrotmini/playground-core/src';

import {
  AggregatorDurableObject,
} from '../base/DurableObjectAggregatorProtocol';

export class UserProfileDurableObject
  extends AggregatorDurableObject<UserProfile>
  implements DurableObject
{
  readonly aggregateName = 'UserProfile' as const;

  spawn(id: UserProfileID, snapshot?: UserProfileSnapshot) {
    return new UserProfile(id, snapshot);
  }
}
