import {
  UserProfile,
} from '../../entities';
import {
  type MutationResolvers,
} from '../__generated__/types';

export const createUserProfile: MutationResolvers['createUserProfile'] = async (
  _root,
  _args,
  {
    repos,
    mutator,
  },
) => {
  const id = repos.UserProfile.newId();
  const userProfile = UserProfile.create({ id });
  return mutator.commit({
    userProfile,
  });
};