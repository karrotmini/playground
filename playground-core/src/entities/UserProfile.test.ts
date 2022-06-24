import { describe, expect } from 'vitest';

import {
  UserProfile,
  UserProfileID,
} from '../entities';

describe('UserProfile', test => {
  test('should be valid after UserProfileCreated', () => {
    const id = UserProfileID('TEST');
    const userProfile = new UserProfile(id);
    userProfile.$publishEvent({
      aggregateId: id,
      aggregateName: 'UserProfile',
      eventName: 'UserProfileCreated',
      eventDate: new Date('2022-06-10').getTime(),
      eventPayload: {
        name: null,
        profileImageUrl: null,
      },
    });

    expect(userProfile.$valid).toBe(true);
    expect(userProfile.$snapshot).toMatchSnapshot(
      `$snapshot version ${userProfile.snapshotVersion}`,
    );
  });

  test('updateProfile() only affects if there is any change', () => {
    const id = UserProfileID('TEST');
    const name = 'TEST';
    const profileImage = new URL('file:///profileImage');
    const userProfile = UserProfile.create({
      id,
      name,
      profileImage,
    });
    userProfile.$pullEvents();

    userProfile.updateProfile({
      name,
      profileImage,
    });
    expect(userProfile.$pullEvents()).toHaveLength(0);

    userProfile.updateProfile({
      name: 'CHANGED',
      profileImage,
    });
    expect(userProfile.$pullEvents()).toHaveLength(1);
  });
});
