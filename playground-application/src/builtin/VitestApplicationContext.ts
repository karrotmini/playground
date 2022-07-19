import { type vi } from 'vitest';

import {
  type App,
  type BundleUpload,
  type UserProfile,
} from '@karrotmini/playground-core/src/entities';
import {
  Mutator,
  deriveLoaders,
  type IEventBus,
  type IApplicationContext,
  type IReporter,
  type ITracer,
} from '../runtime';
import {
  NoopReporter,
  BypassResourceAuthorizer,
  VitestAggregator,
  VitestCustomHostRepository,
  VitestBundleStorage,
  VitestHostnameProvider,
} from '../builtin';

export class VitestApplicationContext implements IApplicationContext {
  env: IApplicationContext['env'];
  loaders: IApplicationContext['loaders'];
  reporter: IApplicationContext['reporter'];
  mutator: IApplicationContext['mutator'];
  authz: IApplicationContext['authz'];
  repos: {
    App: VitestAggregator<App>,
    BundleUpload: VitestAggregator<BundleUpload>,
    CustomHost: VitestCustomHostRepository,
    UserProfile: VitestAggregator<UserProfile>,
  };
  services: {
    bundleStorage: VitestBundleStorage,
    hostnameProvider: VitestHostnameProvider,
  };

  constructor(config: {
    vitestUtils: typeof vi,
    crypto: Crypto,
    eventBus: IEventBus,
    reporter?: IReporter,
    tracer?: ITracer,
  }) {
    this.env = {
      crypto: config.crypto,
      vars: {
        HOSTNAME_PATTERN: '*.karrotmini.app',
      },
      secrets: {
        CREDENTIAL_SECRET: 'TEST',
      },
    };
    this.authz = new BypassResourceAuthorizer();
    this.reporter = config.reporter ?? new NoopReporter();
    this.services = {
      bundleStorage: new VitestBundleStorage(config),
      hostnameProvider: new VitestHostnameProvider(config),
    };
    const repoConfig = {
      newId: () => config.crypto.randomUUID(),
      vitestUtils: config.vitestUtils,
    };
    this.repos = {
      App: new VitestAggregator(repoConfig),
      BundleUpload: new VitestAggregator(repoConfig),
      CustomHost: new VitestCustomHostRepository(repoConfig),
      UserProfile: new VitestAggregator(repoConfig),
    };
    this.loaders = deriveLoaders({ repos: this.repos });
    this.mutator = new Mutator({
      eventBus: config.eventBus,
      repos: this.repos,
      loaders: this.loaders,
    });
  }
}
