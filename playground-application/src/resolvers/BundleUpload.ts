import {
  type BundleUploadResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';
import { globalIdResolver } from './_globalId';

export const BundleUpload: BundleUploadResolvers = {
  id: globalIdResolver,
};
