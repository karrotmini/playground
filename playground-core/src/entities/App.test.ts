import { describe, expect } from 'vitest';
import {
  App,
  AppManifest,
  BundleTemplate,
  AppID,
  UserProfileID,
  CustomHostID,
} from '../entities';

describe('App', test => {
  test('should have valid state after AppCreated', () => {
    const id = AppID('TEST');
    const ownerId = UserProfileID('TEST');
    const customHostId = CustomHostID('TEST');
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
        ownerId,
        customHostId,
      },
    });

    expect(app.$valid).toBe(true);
    expect(app.$snapshot).toMatchSnapshot(`$snapshot version ${app.snapshotVersion}`);
  });

  test('bootstrapFromTemplate', () => {
    const id = AppID('TEST');
    const ownerId = UserProfileID('TEST');
    const customHostId = CustomHostID('TEST');
    const templateId = BundleTemplate.centeringDiv().id;
    const manifest = new AppManifest({
      appId: '123123',
      name: 'TEST',
      icon: 'file:///icon',
    });

    const { app, deployment } = App.bootstrapFromTemplate({
      id,
      ownerId,
      customHostId,
      manifest,
      templateId,
    });

    const expectedDeployment = {
      name: 'live',
      bundle: {
        type: 'template',
        id: templateId,
      },
      customHostId,
      deployedAt: expect.any(Number),
    };

    expect(deployment).toEqual(expectedDeployment);
    expect(app.toJSON()).toEqual({
      id,
      manifest: manifest.toJSON(),
      ownerId,
      customHostId,
      deployments: {
        [expectedDeployment.name]: expectedDeployment,
      },
    });
  });
});
