import {
  App,
  AppBundleUpload,
  CustomHost,
  UserProfile,
} from '@karrotmini/playground-core/src';
import {
  makePlaygroundServiceHandler,
} from '@karromtini/playground-cloudflare-adapter-transport/src/handler';

import {
  AppRepository,
  AppBundleUploadRepository,
  CustomHostRepository,
  UserProfileRepository,
} from './repos';

const handlePlaygroundRequest = makePlaygroundServiceHandler<WranglerEnv>({
  async App_newID(_msg, env) {
    const repo = new AppRepository({ namespace: env.DO_App });
    const id = await repo.newId();
    return { id };
  },
  async App_aggregate({ id }, env) {
    const repo = new AppRepository({ namespace: env.DO_App });
    const app = await repo.aggregate(id);
    return app && { id, snapshot: app.$snapshot };
  },
  async App_commit({ id, snapshot, events }, env) {
    const repo = new AppRepository({ namespace: env.DO_App });
    const app = new App(id, snapshot, events);
    const published = await repo.commit(app);
    return { published };
  },

  async AppBundleUpload_newID(_msg, env) {
    const repo = new AppBundleUploadRepository({ namespace: env.DO_AppBundleUpload });
    const id = await repo.newId();
    return { id };
  },
  async AppBundleUpload_aggregate({ id }, env) {
    const repo = new AppBundleUploadRepository({ namespace: env.DO_AppBundleUpload });
    const appBundleUpload = await repo.aggregate(id);
    return appBundleUpload && { id, snapshot: appBundleUpload.$snapshot };
  },
  async AppBundleUpload_commit({ id, snapshot, events }, env) {
    const repo = new AppBundleUploadRepository({ namespace: env.DO_AppBundleUpload });
    const appBundleUpload = new AppBundleUpload(id, snapshot, events);
    const published = await repo.commit(appBundleUpload);
    return { published };
  },

  async CustomHost_newID({}, env) {
    const repo = new CustomHostRepository({ namespace: env.DO_CustomHost });
    const id = await repo.newId();
    return { id };
  },
  async CustomHost_aggregate({ id }, env) {
    const repo = new CustomHostRepository({ namespace: env.DO_CustomHost });
    const customHost = await repo.aggregate(id);
    return customHost && { id, snapshot: customHost.$snapshot };
  },
  async CustomHost_commit({ id, snapshot, events }, env) {
    const repo = new CustomHostRepository({ namespace: env.DO_CustomHost });
    const customHost = new CustomHost(id, snapshot, events);
    const published = await repo.commit(customHost);
    return { published };
  },

  async UserProfile_newID(_msg, env) {
    const repo = new UserProfileRepository({ namespace: env.DO_UserProfile });
    const id = await repo.newId();
    return { id };
  },
  async UserProfile_aggregate({ id }, env) {
    const repo = new UserProfileRepository({ namespace: env.DO_UserProfile });
    const userProfile = await repo.aggregate(id);
    return userProfile && { id, snapshot: userProfile.$snapshot };
  },
  async UserProfile_commit({ id, snapshot, events }, env) {
    const repo = new UserProfileRepository({ namespace: env.DO_UserProfile });
    const userProfile = new UserProfile(id, snapshot, events);
    const published = await repo.commit(userProfile);
    return { published };
  },
});

const handler: ExportedHandler<WranglerEnv> = {
  fetch: handlePlaygroundRequest,
};

export default handler;
export * from './dos';
