import {
  ApplicationContext,
  Executor,
} from '@karrotmini/playground-core/src';
import {
  AppRepository,
  AppBundleUploadRepository,
  UserProfileRepository,
} from '@karrotmini/playground-cloudflare-adapter/src';

const handler: ExportedHandler<WranglerEnv> = {
  async fetch(request, env, ctx) {
    const applicationContext = new ApplicationContext({
      repos: {
        App: new AppRepository({ service: env.playground }),
        UserProfile: new UserProfileRepository({ service: env.playground }),
      },
    });
    const executor = new Executor({
      context: applicationContext,
    });
  },
};

export default handler;
