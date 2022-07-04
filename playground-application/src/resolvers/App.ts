import {
  AppBundleTemplate,
} from '@karrotmini/playground-core/src/entities';
import {
  InvariantError,
} from '@karrotmini/playground-core/src/errors';

import { type AppResolvers } from '../__generated__/types';
import { globalIdResolver } from './_globalId';

export const App: AppResolvers = {
  id: globalIdResolver,
  version(app) {
    return app.currentVersion;
  },
  manifest(app) {
    return app.manifest;
  },
  async customHost(app, _args, context) {
    const customHost = await context.loaders.CustomHost.load(app.customHostId);
    if (!customHost) {
      throw new InvariantError(`couldn't load CustomHost(${app.customHostId})`);
    }
    return customHost;
  },
  async currentBundle(app, _args, context) {
    switch (app.currentBundle.type) {
      case 'template': {
        return new AppBundleTemplate(app.currentBundle.id);
      }
      case 'upload': {
        const upload = await context.loaders.AppBundleUpload.load(app.currentBundle.id);
        if (!upload) {
          throw new InvariantError(`couldn't load AppBundleUpload(${app.currentBundle.id})`);
        }
        return upload;
      }
    }
  },
};
