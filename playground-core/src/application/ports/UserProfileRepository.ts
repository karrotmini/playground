import {
  type Aggregator,
} from '../../framework';
import {
  type UserProfile,
} from '../../entities';

export interface IUserProfileRepository extends Aggregator<UserProfile> {
}
