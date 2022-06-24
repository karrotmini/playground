import { describe, expect } from 'vitest';
import {
  App,
  AppManifest,
  AppID,
  UserProfileID,
  CustomHostID,
  AppBundleTemplate,
  AppBundleUploadID,
} from '../entities';

describe('App', test => {
  test('should have valid state after AppCreated', () => {
    const id = AppID('TEST');
    const ownerId = UserProfileID('TEST');
    const customHostId = CustomHostID('TEST');
    const bundleId = AppBundleUploadID('TEST');
    const manifest = new AppManifest({
      appId: '123123',
      name: 'TEST',
      icon: 'file:///icon',
    });

    const app = new App(id);
    app.$publishEvent({
      aggregateId: id,
      aggregateName: 'App',
      eventName: 'AppCreated',
      eventDate: new Date('2022-06-10').getTime(),
      eventPayload: {
        manifest: manifest.toJSON(),
        initialBundle: {
          type: 'upload',
          id: bundleId,
        },
        ownerId,
        customHostId,
      },
    });

    expect(app.$valid).toBe(true);
    expect(app.$snapshot).toMatchSnapshot(`$snapshot version ${app.snapshotVersion}`);
  });

  test('createFromTemplate', () => {
    const id = AppID('TEST');
    const ownerId = UserProfileID('TEST');
    const customHostId = CustomHostID('TEST');
    const template = AppBundleTemplate.centeringDiv();
    const manifest = new AppManifest({
      appId: '123123',
      name: 'TEST',
      icon: 'file:///icon',
    });

    const app = App.createFromTemplate({
      id,
      ownerId,
      customHostId,
      manifest,
      template,
    });

    expect(app.toJSON()).toEqual({
      id,
      manifest: manifest.toJSON(),
      ownerId,
      customHostId,
      currentVersion: 1,
      currentBundle: {
        type: 'template',
        id: template.id,
      },
    });
  });
});
