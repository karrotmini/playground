import {
  Resource,
} from '@karrotmini/playground-application/src/runtime';
import {
  type NodeResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

export const globalIdResolver: NodeResolvers['id'] = root => {
  return Resource.toGlobalId({ typename: root.typename, id: root.id });
};
