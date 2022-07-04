import { type NodeResolvers } from '../__generated__/types';
import { toGlobalId } from '../runtime/Resource';

export const globalIdResolver: NodeResolvers['id'] = root => {
  return toGlobalId({ typename: root.typename, id: root.id });
};
