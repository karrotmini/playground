import {
  UserProfileID,
} from '@karrotmini/playground-core/src/entities';
import {
  type QueryResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

import {
  Resource,
  type RepositoryName,
} from '../runtime';

export const Query: QueryResolvers = {
  node(_root, args, context) {
    const { typename, id } = Resource.fromGlobalId(args.id);
    const loader = context.loaders[typename as RepositoryName];
    return loader.load(id as any);
  },
  userProfile(_root, args, context) {
    const { id } = Resource.fromGlobalId(args.id);
    return context.loaders.UserProfile.load(UserProfileID(id));
  },
};
