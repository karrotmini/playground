import { type NodeResolvers } from '../__generated__/types';
import { globalIdResolver } from './_globalId';

export const Node: NodeResolvers = {
  __resolveType(node) {
    return node.typename;
  },
  id: globalIdResolver,
};
