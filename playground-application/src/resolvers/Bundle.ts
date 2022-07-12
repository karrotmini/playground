import {
  BundleUpload,
  BundleTemplate,
} from '@karrotmini/playground-core/src/entities';
import {
  InvariantError
} from '@karrotmini/playground-core/src/errors';
import {
  type BundleResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

export const Bundle: BundleResolvers = {
  __resolveType(node) {
    if (node instanceof BundleUpload) {
      return 'BundleUpload';
    }
    if (node instanceof BundleTemplate) {
      return 'BundleTemplate';
    }
    throw new InvariantError('invalid bundle type');
  },
};
