import {
  App,
  BundleUpload,
  CustomHost,
  UserProfile,
} from '@karrotmini/playground-core/src';
import {
  makePlaygroundServiceHandler,
} from '@karromtini/playground-cloudflare-adapter-transport/src/handler';

import {
  AppRepository,
  BundleUploadRepository,
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

  async BundleUpload_newID(_msg, env) {
    const repo = new BundleUploadRepository({ namespace: env.DO_BundleUpload });
    const id = await repo.newId();
    return { id };
  },
  async BundleUpload_aggregate({ id }, env) {
    const repo = new BundleUploadRepository({ namespace: env.DO_BundleUpload });
    const appBundleUpload = await repo.aggregate(id);
    return appBundleUpload && { id, snapshot: appBundleUpload.$snapshot };
  },
  async BundleUpload_commit({ id, snapshot, events }, env) {
    const repo = new BundleUploadRepository({ namespace: env.DO_BundleUpload });
    const appBundleUpload = new BundleUpload(id, snapshot, events);
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
