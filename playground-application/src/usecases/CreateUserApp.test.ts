import { describe, expect } from 'vitest';

import {
  App,
  AppID,
  CustomHost,
  CustomHostID,
  CustomHostSnapshot,
  UserProfile,
  UserProfileID,
  UserProfileSnapshot,
  HostnameProviderInfo,
} from '@karrotmini/playground-core/src/entities';
import {
  AppCreatedEvent,
  AppDeploymentCreatedEvent,
  CustomHostConnectedEvent,
  CustomHostProvisionedEvent,
  UserAppAddedEvent,
} from '@karrotmini/playground-core/src/events';
import {
  ReservedAppIdError,
  HostnameAlreadyUsedError,
} from '@karrotmini/playground-core/src/errors';
import {
  Resource,
  MutationResult,
} from '../runtime';
import {
  setupApplication,
  eventMatch,
} from '../test/helpers';

import {
  CreateUserAppDocument,
} from './CreateUserApp.generated';

describe('CreateUserApp', test => {
  test('create an App, and a CustomHost at once', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupApplication();

    const userProfileId = UserProfileID('TEST');
    const userProfile = new UserProfile(userProfileId, UserProfileSnapshot({
      createdAt: Date.now(),
      deletedAt: null,
      name: null,
      profileImageUrl: null,
      appIds: [],
    }));
    context.repos.UserProfile.aggregate
      .mockResolvedValueOnce(userProfile);

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
      CreateUserAppDocument, {
        userProfileId: Resource.toGlobalId(userProfile),
        name: 'TEST',
        appId: 'myapp',
      },
    );
    expect(MutationResult.unwrap(result)).not.toBeNull();

    expect(context.repos.UserProfile.commit).toBeCalled();
    expect(context.repos.App.commit).toBeCalled();
    expect(context.repos.CustomHost.commit).toBeCalled();

    const record = eventBus.pull();

    const userProfileEvents = record.filter(event => event.aggregateName === 'UserProfile');
    expect(userProfileEvents).toEqual([
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

  test('create an App, and create a CustomHost with a dangling hostname', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupApplication();

    const userProfileId = UserProfileID('TEST');
    const userProfile = new UserProfile(userProfileId, UserProfileSnapshot({
      createdAt: Date.now(),
      deletedAt: null,
      name: null,
      profileImageUrl: null,
      appIds: [],
    }));
    context.repos.UserProfile.aggregate
      .mockResolvedValueOnce(userProfile);

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
      CreateUserAppDocument, {
        userProfileId: Resource.toGlobalId(userProfile),
        name: 'TEST',
        appId: 'myapp',
      },
    );
    expect(MutationResult.unwrap(result)).not.toBeNull();

    expect(context.services.hostnameProvider.createHostname).not.toBeCalled();
    expect(context.repos.UserProfile.commit).toBeCalled();
    expect(context.repos.App.commit).toBeCalled();
    expect(context.repos.CustomHost.commit).toBeCalled();

    const record = eventBus.pull();

    const userProfileEvents = record.filter(event => event.aggregateName === 'UserProfile');
    expect(userProfileEvents).toEqual([
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
          deploymentName: expect.any(String),
        },
      }),
    ]);

    const appEvnets = record.filter(event => event.aggregateName === 'App');
    expect(appEvnets).toEqual(
      [
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
      ],
    );
  });

  test('create an App, and reuse a dangling CustomHost', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupApplication();

    const userProfileId = UserProfileID('TEST');
    const userProfile = new UserProfile(userProfileId, UserProfileSnapshot({
      createdAt: Date.now(),
      deletedAt: null,
      name: null,
      profileImageUrl: null,
      appIds: [],
    }));
    context.repos.UserProfile.aggregate
      .mockResolvedValueOnce(userProfile);

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

    const result = await executor.execute(
      CreateUserAppDocument, {
        userProfileId: Resource.toGlobalId(userProfile),
        name: 'TEST',
        appId: 'myapp',
      },
    );
    expect(MutationResult.unwrap(result)).not.toBeNull();

    expect(context.services.hostnameProvider.createHostname).not.toBeCalled();
    expect(context.services.hostnameProvider.searchHostname).not.toBeCalled();
    expect(context.repos.UserProfile.commit).toBeCalled();
    expect(context.repos.App.commit).toBeCalled();
    expect(context.repos.CustomHost.commit).toBeCalled();

    const record = eventBus.pull();

    const userProfileEvents = record.filter(event => event.aggregateName === 'UserProfile');
    expect(userProfileEvents).toEqual([
      eventMatch<UserAppAddedEvent>({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserAppAdded',
        eventPayload: {
          appId,
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
    expect(appEvnets).toEqual(
      [
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
      ],
    );
  });

  test('fail on reserved app id', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupApplication();

    const userProfileId = UserProfileID('TEST');
    const userProfile = new UserProfile(userProfileId, UserProfileSnapshot({
      createdAt: Date.now(),
      deletedAt: null,
      name: null,
      profileImageUrl: null,
      appIds: [],
    }));
    context.repos.UserProfile.aggregate
      .mockResolvedValueOnce(userProfile);

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

    const result = await executor.execute(
      CreateUserAppDocument, {
        userProfileId: Resource.toGlobalId(userProfile),
        name: 'TEST',
        appId: 'daangn',
      },
    );

    expect(MutationResult.unwrapError(result))
      .toBeInstanceOf(ReservedAppIdError);

    expect(context.repos.UserProfile.commit).not.toBeCalled();
    expect(context.repos.App.commit).not.toBeCalled();
    expect(context.repos.CustomHost.commit).not.toBeCalled();

    const record = eventBus.pull();
    expect(record).toHaveLength(0);
  });

  test('fail if the hostname is already taken', async () => {
    const {
      executor,
      context,
      eventBus,
    } = setupApplication();

    const userProfileId = UserProfileID('TEST');
    const userProfile = new UserProfile(userProfileId, UserProfileSnapshot({
      createdAt: Date.now(),
      deletedAt: null,
      name: null,
      profileImageUrl: null,
      appIds: [],
    }));
    context.repos.UserProfile.aggregate
      .mockResolvedValueOnce(userProfile);

    const appId = AppID('TEST');
    const otherAppId = AppID('OTHER_APP_ID');
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
          connectedApp: {
            id: otherAppId,
            deploymentName: 'anything',
          },
        }));
      });

    const result = await executor.execute(
      CreateUserAppDocument, {
        userProfileId: Resource.toGlobalId(userProfile),
        name: 'TEST',
        appId: 'daangn',
      },
    );

    expect(MutationResult.unwrapError(result))
      .toBeInstanceOf(HostnameAlreadyUsedError);

    expect(context.repos.UserProfile.commit).not.toBeCalled();
    expect(context.repos.App.commit).not.toBeCalled();
    expect(context.repos.CustomHost.commit).not.toBeCalled();

    const record = eventBus.pull();
    expect(record).toHaveLength(0);
  });
});
