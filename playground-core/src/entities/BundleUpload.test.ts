import { describe, expect } from 'vitest';

import {
  AppID,
  BundleUpload,
  BundleUploadID,
  UserProfileID,
} from '../entities';

describe('BundleUpload', test => {
  test('should have valid state after BundleUpload', () => {
    const id = BundleUploadID('TEST');
    const appId = AppID('TEST');
    const uploaderId = UserProfileID('TEST');

    const upload = new BundleUpload(id);
    upload.$publishEvent({
      aggregateId: id,
      aggregateName: 'BundleUpload',
      eventName: 'BundleUploaded',
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
