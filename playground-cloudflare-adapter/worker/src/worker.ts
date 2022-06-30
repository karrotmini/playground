import {
  App,
  UserProfile,
} from '@karrotmini/playground-core/src';
import {
  makePlaygroundServiceHandler,
} from '@karromtini/playground-cloudflare-adapter-transport/src/handler';

import { AppRepository } from './AppRepository';
import { UserProfileRepository } from './UserProfileRepository';

const handlePlaygroundRequest = makePlaygroundServiceHandler<WranglerEnv>({
  async App_newID(_msg, env) {
    const repo = new AppRepository({ namespace: env.DO_APP_REPOSITORY });
    const id = await repo.newId();
    return { id };
  },
  async App_aggregate({ id }, env) {
    const repo = new AppRepository({ namespace: env.DO_APP_REPOSITORY });
    const app = await repo.aggregate(id);
    return app && { id, snapshot: app.$snapshot };
  },
  async App_commit({ id, snapshot, events }, env) {
    const repo = new AppRepository({ namespace: env.DO_APP_REPOSITORY });
    const app = new App(id, snapshot, events);
    const published = await repo.commit(app);
    return { published };
  },
  async UserProfile_newID(_msg, env) {
    const repo = new UserProfileRepository({ namespace: env.DO_USER_PROFILE_REPOSITORY });
    const id = await repo.newId();
    return { id };
  },
  async UserProfile_aggregate({ id }, env) {
    const repo = new UserProfileRepository({ namespace: env.DO_USER_PROFILE_REPOSITORY });
    const userProfile = await repo.aggregate(id);
    return userProfile && { id, snapshot: userProfile.$snapshot };
  },
  async UserProfile_commit({ id, snapshot, events }, env) {
    const repo = new UserProfileRepository({ namespace: env.DO_USER_PROFILE_REPOSITORY });
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
