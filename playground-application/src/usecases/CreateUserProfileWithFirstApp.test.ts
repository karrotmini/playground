import { describe, expect } from 'vitest';

import {
  AppID,
  AppBundleTemplate,
  CustomHost,
  CustomHostID,
  CustomHostSnapshot,
  UserProfileID,
  HostnameProviderInfo,
} from '@karrotmini/playground-core/src/entities';
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
      eventMatch({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserProfileCreated',
        eventPayload: {
          name: null,
          profileImageUrl: null,
        },
      }),
      eventMatch({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserAppAdded',
        eventPayload: {
          appId: appId,
          userProfileId,
        },
      }),
    ]);

    const customHostEvents = record.filter(event => event.aggregateName === 'CustomHost');
    expect(customHostEvents).toEqual([
      eventMatch({
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
      eventMatch({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostConnected',
        eventPayload: {
          appId,
          customHostId,
        },
      }),
    ]);

    const appEvnets = record.filter(event => event.aggregateName === 'App');
    expect(appEvnets).toEqual(
      [
        eventMatch({
          aggregateId: appId,
          aggregateName: 'App',
          eventName: 'AppCreated',
          eventPayload: {
            customHostId,
            ownerId: userProfileId,
            initialBundle: {
              type: 'template',
              id: AppBundleTemplate.centeringDiv().id,
            },
            manifest: {
              appId: 'myapp',
              name: 'TEST',
              icon: expect.stringMatching(/^data:image\/svg\+xml,/),
            },
          },
        }),
      ],
    );
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
      eventMatch({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserProfileCreated',
        eventPayload: {
          name: null,
          profileImageUrl: null,
        },
      }),
      eventMatch({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserAppAdded',
        eventPayload: {
          appId: appId,
          userProfileId,
        },
      }),
    ]);

    const customHostEvents = record.filter(event => event.aggregateName === 'CustomHost');
    expect(customHostEvents).toEqual([
      eventMatch({
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
      eventMatch({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostConnected',
        eventPayload: {
          appId,
          customHostId,
        },
      }),
    ]);

    const appEvnets = record.filter(event => event.aggregateName === 'App');
    expect(appEvnets).toEqual(
      [
        eventMatch({
          aggregateId: appId,
          aggregateName: 'App',
          eventName: 'AppCreated',
          eventPayload: {
            customHostId,
            ownerId: userProfileId,
            initialBundle: {
              type: 'template',
              id: AppBundleTemplate.centeringDiv().id,
            },
            manifest: {
              appId: 'myapp',
              name: 'TEST',
              icon: expect.stringMatching(/^data:image\/svg\+xml,/),
            },
          },
        }),
      ],
    );
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
          deletedAt: null,
          providerInfo: {
            hostname,
            healthCheckUrl: 'https://healthcheck/',
            managementUrl: 'https://management/',
          },
          connectedAppId: null,
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
      eventMatch({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserProfileCreated',
        eventPayload: {
          name: null,
          profileImageUrl: null,
        },
      }),
      eventMatch({
        aggregateId: userProfileId,
        aggregateName: 'UserProfile',
        eventName: 'UserAppAdded',
        eventPayload: {
          appId: appId,
          userProfileId,
        },
      }),
    ]);

    const customHostEvents = record.filter(event => event.aggregateName === 'CustomHost');
    expect(customHostEvents).toEqual([
      eventMatch({
        aggregateId: customHostId,
        aggregateName: 'CustomHost',
        eventName: 'CustomHostConnected',
        eventPayload: {
          appId,
          customHostId,
        },
      }),
    ]);

    const appEvnets = record.filter(event => event.aggregateName === 'App');
    expect(appEvnets).toEqual(
      [
        eventMatch({
          aggregateId: appId,
          aggregateName: 'App',
          eventName: 'AppCreated',
          eventPayload: {
            customHostId,
            ownerId: userProfileId,
            initialBundle: {
              type: 'template',
              id: AppBundleTemplate.centeringDiv().id,
            },
            manifest: {
              appId: 'myapp',
              name: 'TEST',
              icon: expect.stringMatching(/^data:image\/svg\+xml,/),
            },
          },
        }),
      ],
    );
  });
});
