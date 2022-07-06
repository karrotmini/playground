import {
  type AppManifestResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

export const AppManifest: AppManifestResolvers = {
  name(manifest) {
    return manifest.name;
  },
  icon(manifest) {
    return manifest.icon.toString();
  },
};
