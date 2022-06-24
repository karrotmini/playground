import { describe, expect } from 'vitest';

import {
  AppID,
  AppBundleUpload,
  AppBundleUploadID,
  UserProfileID,
} from '../entities';

describe('AppBundleUpload', test => {
  test('should have valid state after AppBundleUpload', () => {
    const id = AppBundleUploadID('TEST');
    const appId = AppID('TEST');
    const uploaderId = UserProfileID('TEST');

    const upload = new AppBundleUpload(id);
    upload.$publishEvent({
      aggregateId: id,
      aggregateName: 'AppBundleUpload',
      eventName: 'AppBundleUploaded',
      eventDate: new Date('2022-06-10').getTime(),
      eventPayload: {
        appId,
        uploaderId,
      },
    });

    expect(upload.$valid).toBe(true);
    expect(upload.$snapshot).toMatchSnapshot(`$snapshot version ${upload.snapshotVersion}`);
  });
});
