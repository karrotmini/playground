import {
  type BundleTemplateResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';
import { globalIdResolver } from './_globalId';

export const BundleTemplate: BundleTemplateResolvers = {
  id: globalIdResolver,
};
