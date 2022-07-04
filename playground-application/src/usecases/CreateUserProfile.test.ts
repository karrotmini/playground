import { describe, expect } from 'vitest';

import {
  UserProfileID,
} from '@karrotmini/playground-core/src/entities';
import {
  MutationResult,
} from '../runtime';
import {
  setupVitestContext,
  eventMatch,
} from '../test/helpers';

import { CreateUserProfileDocument } from './CreateUserProfile.generated';

describe('CreateUserProfile', test => {
  test('happy path', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupVitestContext();

    const aggregateId = UserProfileID('TEST');
    context.repos.UserProfile.newId
      .mockResolvedValueOnce(aggregateId);

    const result = await executor.execute(
      CreateUserProfileDocument, {
      },
    );

    expect(MutationResult.unwrap(result)).not.toBeNull();
    expect(context.repos.UserProfile.commit).toHaveBeenCalledOnce();

    const record = eventBus.pull();
    expect(record).toEqual(
      [
        eventMatch({
          aggregateId,
          aggregateName: 'UserProfile',
          eventName: 'UserProfileCreated',
          eventPayload: {
            name: null,
            profileImageUrl: null,
          },
        }),
      ],
    );
  });
});
