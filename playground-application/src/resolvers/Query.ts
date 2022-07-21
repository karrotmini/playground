import {
  UserProfileID,
} from '@karrotmini/playground-core/src/entities';
import {
  type QueryResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';
import {
  Resource,
  type RepositoryName,
} from '@karrotmini/playground-application/src/runtime';

export const Query: QueryResolvers = {
  node(_root, args, { application }) {
    const { typename, id } = Resource.fromGlobalId(args.id);
    const loader = application.loaders[typename as RepositoryName];
    return loader.load(id as any);
  },
  userProfile(_root, args, { application }) {
    const { id } = Resource.fromGlobalId(args.id);
    return application.loaders.UserProfile.load(UserProfileID(id));
  },
};
