import { describe, expect } from 'vitest';

import {
  CustomHost,
  CustomHostID,
  HostnameProviderInfo,
} from '../entities';

describe('CustomHost', test => {
  test('should be valid after CustomHostProvisioned', () => {
    const id = CustomHostID('TEST');
    const providerInfo = new HostnameProviderInfo({
      hostname: 'test.karrotmini.app',
      healthCheckUrl: 'https://management',
      managementUrl: 'https://healthcheck',
    });

    const customHost = new CustomHost(id);
    customHost.$publishEvent({
      aggregateId: id,
      aggregateName: 'CustomHost',
      eventName: 'CustomHostProvisioned',
      eventDate: new Date('2022-06-10').getTime(),
      eventPayload: {
        providerInfo: providerInfo.toJSON(),
      },
    });

    expect(customHost.$valid).toBe(true);
    expect(customHost.$snapshot).toMatchSnapshot(
      `$snapshot version ${customHost.snapshotVersion}`,
    );
  });

  test('create without appId', () => {
    const id = CustomHostID('TEST');
    const providerInfo = new HostnameProviderInfo({
      hostname: 'test.karrotmini.app',
      healthCheckUrl: 'https://management',
      managementUrl: 'https://healthcheck',
    });

    const customHost = CustomHost.createWithProviderInfo({
      id,
      providerInfo,
    });

    expect(customHost.toJSON()).toEqual({
      id,
      providerInfo: providerInfo.toJSON(),
      connectedApp: null,
    });
  });

  test('create with appId', () => {
    const id = CustomHostID('TEST');
    const providerInfo = new HostnameProviderInfo({
      hostname: 'test.karrotmini.app',
      healthCheckUrl: 'https://management',
      managementUrl: 'https://healthcheck',
    });

    const customHost = CustomHost.createWithProviderInfo({
      id,
      providerInfo,
    });

    expect(customHost.toJSON()).toEqual({
      id,
      providerInfo: providerInfo.toJSON(),
      connectedApp: null,
    });
  });
});
