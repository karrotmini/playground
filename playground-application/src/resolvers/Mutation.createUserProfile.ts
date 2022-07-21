import {
  UserProfile,
} from '@karrotmini/playground-core/src/entities';
import {
  type MutationResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

export const createUserProfile: MutationResolvers['createUserProfile'] = async (
  _root,
  _args,
  { application },
) => {
  const id = await application.repos.UserProfile.newId();
  const userProfile = UserProfile.create({ id });

  return application.mutator.commit({
    userProfile,
  });
};
