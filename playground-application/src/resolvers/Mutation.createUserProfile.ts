import {
  UserProfile,
} from '@karrotmini/playground-core/src/entities';
import {
  type MutationResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

export const createUserProfile: MutationResolvers['createUserProfile'] = async (
  _root,
  _args,
  {
    repos,
    mutator,
  },
) => {
  const id = await repos.UserProfile.newId();
  const userProfile = UserProfile.create({ id });
  return mutator.commit({
    userProfile,
  });
};
