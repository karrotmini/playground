import { Condition } from '@cometjs/core';
import {
  type UserProfileResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

import { globalIdResolver } from './_globalId';

export const UserProfile: UserProfileResolvers = {
  id: globalIdResolver,
  name(userProfile) {
    return userProfile.name;
  },
  profileImageUrl(userProfile) {
    return userProfile.profileImageUrl.toString();
  },
  async apps(userProfile, _args, { application }) {
    const apps = await Promise.all(
      userProfile.appIds.map(appId => application.loaders.App.load(appId)),
    );
    return apps.filter(Condition.isTruthy);
  },
};
