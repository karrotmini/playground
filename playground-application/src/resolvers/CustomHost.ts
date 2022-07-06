import {
  type CustomHostResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

import { globalIdResolver } from './_globalId';

export const CustomHost: CustomHostResolvers = {
  id: globalIdResolver,
  providerInfo(customHost) {
    return customHost.providerInfo;
  },
};
