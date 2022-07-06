import {
  ResourceLoadFailureError,
} from '@karrotmini/playground-core/src/framework';
import {
  UserProfileID,
} from '@karrotmini/playground-core/src/entities';
import {
  Resource,
} from '@karrotmini/playground-application/src/runtime';
import {
  type MutationResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

import { createApp as _createApp } from './_createApp';

export const createApp: MutationResolvers['createApp'] = async (
  _root,
  args,
  context,
) => {
  const {
    authz,
    mutator,
    loaders,
  } = context;
  const resource = Resource.fromGlobalId(args.input.userProfileId);
  authz.guard(resource, 'write');

  const userProfileId = UserProfileID(resource.id);
  const userProfile = await loaders.UserProfile.load(userProfileId);
  if (!userProfile) {
    throw new ResourceLoadFailureError(resource);
  }

  const result = await _createApp(
    { userProfile },
    args,
    context,
  );

  return mutator.commit(result);
};
