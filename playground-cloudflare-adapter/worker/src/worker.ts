import {
  UserProfile,
} from '@karrotmini/playground-core/src';
import {
  makePlaygroundServiceHandler,
} from '@karromtini/playground-cloudflare-adapter-transport/src/handler';

import { UserProfileRepository } from './UserProfileRepository';

const handlePlaygroundRequest = makePlaygroundServiceHandler<WranglerEnv>({
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
  }
});

const handler: ExportedHandler<WranglerEnv> = {
  fetch: handlePlaygroundRequest,
};

export default handler;
export * from './dos';
