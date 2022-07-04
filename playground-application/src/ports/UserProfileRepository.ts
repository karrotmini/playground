import {
  type Aggregator,
} from '@karrotmini/playground-core/src/framework';
import {
  type UserProfile,
} from '@karrotmini/playground-core/src/entities';

export interface IUserProfileRepository extends Aggregator<UserProfile> {
}
