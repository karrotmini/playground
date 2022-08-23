import { describe, expect } from 'vitest';
import {
  App,
  AppID,
  BundleTemplate,
  BundleTemplateID,
  CustomHostID,
  UserProfileID,
  type DeploymentRef,
} from '../entities';

describe('App', test => {
  test('should have valid state after AppCreated', () => {
    const id = AppID('TEST');
    const templateId = BundleTemplateID('TEST');
    const ownerId = UserProfileID('TEST');
    const customHostId = CustomHostID('TEST');

    const app = new App(id);
    app.$publishEvent({
      aggregateId: id,
      aggregateName: 'App',
      eventName: 'AppCreatedFromTemplate',
      eventDate: new Date('2022-06-10').getTime(),
      eventPayload: {
        name: 'test',
        tenantId: 'test.karrotmini.app',
        templateId,
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

    const { app, deployment } = App.bootstrapFromTemplate({
      name: 'test',
      tenantId: 'test.karrotmini.app',
      id,
      ownerId,
      customHostId,
      templateId,
    });

    const expectedDeployment: DeploymentRef = {
      name: 'live',
      bundle: {
        kind: 'Template',
        value: {
          id: templateId,
        },
      },
      custom_host_id: customHostId,
      deployed_at: expect.any(Number),
    };

    expect(deployment).toEqual(expectedDeployment);
  });
});
