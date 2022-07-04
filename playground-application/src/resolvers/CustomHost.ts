import { type CustomHostResolvers } from '../__generated__/types';
import { globalIdResolver } from './_globalId';

export const CustomHost: CustomHostResolvers = {
  id: globalIdResolver,
  providerInfo(customHost) {
    return customHost.providerInfo;
  },
};
