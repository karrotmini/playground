import { type HostnameProviderInfoResolvers } from '../__generated__/types';

export const HostnameProviderInfo: HostnameProviderInfoResolvers = {
  url(provierInfo) {
    return `https://${provierInfo.hostname}`;
  },
  hostname(info) {
    return info.hostname;
  },
  managementUrl(info) {
    return info.managementUrl.toString();
  },
  healthCheckUrl(info) {
    return info.healthCheckUrl.toString();
  },
};
