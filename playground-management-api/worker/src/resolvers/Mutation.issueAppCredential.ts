import {
  AppID,
} from '@karrotmini/playground-core/src';
import {
  Resource,
  ResourceLoadingError,
} from '@karrotmini/playground-application/src';
import {
  type MutationResolvers,
} from '@karrotmini/playground-management-api-worker/src/__generated__/types';

import * as Credential from '../credential';

export const issueAppCredential: MutationResolvers['issueAppCredential'] = async (
  _root,
  args,
  { application, bindings },
) => {
  const resource = Resource.fromGlobalId(args.input.appId);

  const appId = AppID(resource.id);
  const app = await application.repos.App.aggregate(appId);
  if (!app) {
    throw new ResourceLoadingError(resource);
  }

  const credential = await Credential.sign({
    crypto,
    textEncoder: new TextEncoder(),
    payload: {
      typename: 'App',
      id: appId,
      grant: [args.input.permission],
      via: '@karrotmini/playground-management-api-worker',
      at: Date.now(),
    },
    secret: bindings.CREDENTIAL_SECRET,
  });

  return {
    credential,
  };
};
