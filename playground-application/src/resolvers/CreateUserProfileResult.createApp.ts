import {
  type CreateUserProfileResultResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

import {
  createApp as _createApp,
} from './_createApp';

export const createApp: CreateUserProfileResultResolvers['createApp'] = async (
  root,
  args,
  context,
) => {
  const {
    mutator,
  } = context;

  const result = await _createApp(
    root,
    args,
    context,
  );

  return mutator.commit(result);
};
