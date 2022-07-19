import { describe, expect } from 'vitest';

import {
  App,
  AppID,
  CustomHost,
  CustomHostID,
  CustomHostSnapshot,
  UserProfileID,
  HostnameProviderInfo,
} from '@karrotmini/playground-core/src/entities';
import {
  AppCreatedEvent,
  AppDeploymentCreatedEvent,
  CustomHostConnectedEvent,
  CustomHostProvisionedEvent,
  UserAppAddedEvent,
  UserProfileCreatedEvent,
} from '@karrotmini/playground-core/src/events';
import {
  MutationResult,
} from '../runtime';
import {
  setupVitestContext,
  eventMatch,
} from '../test/helpers';

import {
  CreateUserProfileWithFirstAppDocument,
} from './CreateUserProfileWithFirstApp.generated';

describe('CreateUserProfileWithFirstApp', test => {
  test('create a UserProfile, an App and a CustomHost at once', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupVitestContext();

    const userProfileId = UserProfileID('TEST');
    context.repos.UserProfile.newId
      .mockResolvedValueOnce(userProfileId);

    const appId = AppID('TEST');
    context.repos.App.newId
      .mockResolvedValueOnce(appId);

    const customHostId = CustomHostID('TEST');
    context.repos.CustomHost.newId
      .mockResolvedValueOnce(customHostId);
    context.repos.CustomHost.queryByHostname
      .mockResolvedValueOnce(null);

    context.services.hostnameProvider.searchHostname
      .mockResolvedValueOnce(null);
    context.services.hostnameProvider.createHostname
      .mockImplementationOnce(async props => {
        return new HostnameProviderInfo({
          hostname: props.hostname,
          healthCheckUrl: 'https://healthcheck/',
          managementUrl: 'https://management/',
        });
      });

    const result = await executor.execute(
      CreateUserProfileWithFirstAppDocument, {
        name: 'TEST',
        appId: 'myapp',
      },
    );
    expect(MutationResult.unwrap(result)).not.toBeNull();

    expect(context.repos.UserProfile.commit).toHaveBeenCalled();
    expect(context.repos.CustomHost.commit).toHaveBeenCalled();
    expect(context.repos.App.commit).toHaveBeenCalled();

    const record = eventBus.pull();

    const userProfileEvents = record.filter(event => event.aggregateName === 'UserProfile');
    expect(userProfileEvents).toEqual([
      eventMatch<UserProfileCreatedEvent>({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserProfileCreated',
        eventPayload: {
          name: null,
          profileImageUrl: null,
        },
      }),
      eventMatch<UserAppAddedEvent>({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserAppAdded',
        eventPayload: {
          appId: appId,
        },
      }),
    ]);

    const customHostEvents = record.filter(event => event.aggregateName === 'CustomHost');
    expect(customHostEvents).toEqual([
      eventMatch<CustomHostProvisionedEvent>({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostProvisioned',
        eventPayload: {
          providerInfo: {
            hostname: context.env.vars.HOSTNAME_PATTERN.replace('*', 'myapp'),
            healthCheckUrl: 'https://healthcheck/',
            managementUrl: 'https://management/',
          },
        },
      }),
      eventMatch<CustomHostConnectedEvent>({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostConnected',
        eventPayload: {
          appId,
          deploymentName: App.DEFAULT_DEPLOYMENT_NAME,
        },
      }),
    ]);

    const appEvnets = record.filter(event => event.aggregateName === 'App');
    expect(appEvnets).toEqual([
      eventMatch<AppCreatedEvent>({
        aggregateId: appId,
        aggregateName: 'App',
        eventName: 'AppCreated',
        eventPayload: {
          customHostId,
          ownerId: userProfileId,
          manifest: {
            appId: 'myapp',
            name: 'TEST',
            icon: expect.stringMatching(/^data:image\/svg\+xml,/),
          },
        },
      }),
      eventMatch<AppDeploymentCreatedEvent>({
        aggregateId: appId,
        aggregateName: 'App',
        eventName: 'AppDeploymentCreated',
        eventPayload: {
          deployment: {
            name: App.DEFAULT_DEPLOYMENT_NAME,
            bundle: {
              type: 'template',
              id: expect.any(String),
            },
            customHostId,
            deployedAt: expect.any(Number),
          },
        },
      }),
    ]);
  });

  test('Create UserProfile and App, reuse a dangling hostname', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupVitestContext();

    const userProfileId = UserProfileID('TEST');
    context.repos.UserProfile.newId
      .mockResolvedValueOnce(userProfileId);

    const appId = AppID('TEST');
    context.repos.App.newId
      .mockResolvedValueOnce(appId);

    const customHostId = CustomHostID('TEST');
    context.repos.CustomHost.newId
      .mockResolvedValueOnce(customHostId);
    context.repos.CustomHost.queryByHostname
      .mockResolvedValueOnce(null);

    context.services.hostnameProvider.searchHostname
      .mockImplementationOnce(async props => {
        return new HostnameProviderInfo({
          hostname: props.hostname,
          healthCheckUrl: 'https://healthcheck/',
          managementUrl: 'https://management/',
        });
      });

    const result = await executor.execute(
      CreateUserProfileWithFirstAppDocument, {
        name: 'TEST',
        appId: 'myapp',
      },
    );
    expect(MutationResult.unwrap(result)).not.toBeNull();

    expect(context.services.hostnameProvider.createHostname).not.toBeCalled();
    expect(context.repos.UserProfile.commit).toHaveBeenCalled();
    expect(context.repos.CustomHost.commit).toHaveBeenCalled();
    expect(context.repos.App.commit).toHaveBeenCalled();

    const record = eventBus.pull();

    const userProfileEvents = record.filter(event => event.aggregateName === 'UserProfile');
    expect(userProfileEvents).toEqual([
      eventMatch<UserProfileCreatedEvent>({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserProfileCreated',
        eventPayload: {
          name: null,
          profileImageUrl: null,
        },
      }),
      eventMatch<UserAppAddedEvent>({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserAppAdded',
        eventPayload: {
          appId: appId,
        },
      }),
    ]);

    const customHostEvents = record.filter(event => event.aggregateName === 'CustomHost');
    expect(customHostEvents).toEqual([
      eventMatch<CustomHostProvisionedEvent>({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostProvisioned',
        eventPayload: {
          providerInfo: {
            hostname: context.env.vars.HOSTNAME_PATTERN.replace('*', 'myapp'),
            healthCheckUrl: 'https://healthcheck/',
            managementUrl: 'https://management/',
          },
        },
      }),
      eventMatch<CustomHostConnectedEvent>({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostConnected',
        eventPayload: {
          appId,
          deploymentName: App.DEFAULT_DEPLOYMENT_NAME,
        },
      }),
    ]);

    const appEvnets = record.filter(event => event.aggregateName === 'App');
    expect(appEvnets).toEqual([
      eventMatch<AppCreatedEvent>({
        aggregateId: appId,
        aggregateName: 'App',
        eventName: 'AppCreated',
        eventPayload: {
          customHostId,
          ownerId: userProfileId,
          manifest: {
            appId: 'myapp',
            name: 'TEST',
            icon: expect.stringMatching(/^data:image\/svg\+xml,/),
          },
        },
      }),
      eventMatch<AppDeploymentCreatedEvent>({
        aggregateId: appId,
        aggregateName: 'App',
        eventName: 'AppDeploymentCreated',
        eventPayload: {
          deployment: {
            name: App.DEFAULT_DEPLOYMENT_NAME,
            bundle: {
              type: 'template',
              id: expect.any(String),
            },
            customHostId,
            deployedAt: expect.any(Number),
          },
        },
      }),
    ]);
  });

  test('Create UserProfile and App, reuse a dangling CustomHost instance', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupVitestContext();

    const userProfileId = UserProfileID('TEST');
    context.repos.UserProfile.newId
      .mockResolvedValueOnce(userProfileId);

    const appId = AppID('TEST');
    context.repos.App.newId
      .mockResolvedValueOnce(appId);

    const customHostId = CustomHostID('TEST');
    context.repos.CustomHost.queryByHostname
      .mockImplementationOnce(async hostname => {
        return new CustomHost(customHostId, CustomHostSnapshot({
          createdAt: Date.now(),
          providerInfo: {
            hostname,
            healthCheckUrl: 'https://healthcheck/',
            managementUrl: 'https://management/',
          },
          connectedApp: null,
        }));
      });

    context.services.hostnameProvider.searchHostname
      .mockImplementationOnce(async props => {
        return new HostnameProviderInfo({
          hostname: props.hostname,
          healthCheckUrl: 'https://healthcheck/',
          managementUrl: 'https://management/',
        });
      });

    const result = await executor.execute(
      CreateUserProfileWithFirstAppDocument, {
        name: 'TEST',
        appId: 'myapp',
      },
    );
    expect(MutationResult.unwrap(result)).not.toBeNull();

    expect(context.services.hostnameProvider.searchHostname).not.toBeCalled();
    expect(context.services.hostnameProvider.createHostname).not.toBeCalled();
    expect(context.repos.UserProfile.commit).toHaveBeenCalled();
    expect(context.repos.CustomHost.commit).toHaveBeenCalled();
    expect(context.repos.App.commit).toHaveBeenCalled();

    const record = eventBus.pull();

    const userProfileEvents = record.filter(event => event.aggregateName === 'UserProfile');
    expect(userProfileEvents).toEqual([
      eventMatch<UserProfileCreatedEvent>({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserProfileCreated',
        eventPayload: {
          name: null,
          profileImageUrl: null,
        },
      }),
      eventMatch<UserAppAddedEvent>({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserAppAdded',
        eventPayload: {
          appId: appId,
        },
      }),
    ]);

    const customHostEvents = record.filter(event => event.aggregateName === 'CustomHost');
    expect(customHostEvents).toEqual([
      eventMatch<CustomHostConnectedEvent>({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostConnected',
        eventPayload: {
          appId,
          deploymentName: App.DEFAULT_DEPLOYMENT_NAME,
        },
      }),
    ]);

    const appEvnets = record.filter(event => event.aggregateName === 'App');
    expect(appEvnets).toEqual([
      eventMatch<AppCreatedEvent>({
        aggregateId: appId,
        aggregateName: 'App',
        eventName: 'AppCreated',
        eventPayload: {
          customHostId,
          ownerId: userProfileId,
          manifest: {
            appId: 'myapp',
            name: 'TEST',
            icon: expect.stringMatching(/^data:image\/svg\+xml,/),
          },
        },
      }),
      eventMatch<AppDeploymentCreatedEvent>({
        aggregateId: appId,
        aggregateName: 'App',
        eventName: 'AppDeploymentCreated',
        eventPayload: {
          deployment: {
            name: App.DEFAULT_DEPLOYMENT_NAME,
            bundle: {
              type: 'template',
              id: expect.any(String),
            },
            customHostId,
            deployedAt: expect.any(Number),
          },
        },
      }),
    ]);
  });
});
