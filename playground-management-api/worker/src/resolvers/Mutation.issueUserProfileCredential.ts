import {
  type MutationResolvers,
} from '@karrotmini/playground-management-api-worker/src/__generated__/types';

export const issueUserProfileCredential: MutationResolvers['issueUserProfileCredential'] = async (
  _root,
  args,
  {
    repos,
    mutator,
  },
) => {
  throw new Error('not implemented');
};
