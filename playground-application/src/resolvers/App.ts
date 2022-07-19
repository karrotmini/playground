import {
  ResourceLoadingError,
} from '@karrotmini/playground-application/src/errors';
import {
  type AppResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

import { globalIdResolver } from './_globalId';

export const App: AppResolvers = {
  id: globalIdResolver,
  manifest(app) {
    return app.manifest;
  },
  liveDeployment(app) {
    return app.liveDeployment;
  },
  deployments(app) {
    return Object.values(app.deployments)
      .sort((a, b) => b.deployedAt - a.deployedAt);
  },
  async canonicalHost(app, _args, context) {
    const customHost = await context.loaders.CustomHost.load(app.customHostId);
    if (!customHost) {
      throw new ResourceLoadingError({ typename: 'CustomHost', id: app.customHostId });
    }
    return customHost;
  },
};
