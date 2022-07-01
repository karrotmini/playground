import { type vi } from 'vitest';

import {
  type App,
  type AppBundleUpload,
  type UserProfile,
} from '../../entities';
import {
  Mutator,
  deriveLoaders,
  type IResourceAuthorizer,
  type IEventBus,
  type IApplicationContext,
  type IReporter,
  type ITracer,
} from '../runtime';
import {
  NoopReporter,
  NoopTracer,
  BypassResourceAuthorizer,
  VitestAggregator,
  VitestCustomHostRepository,
  VitestAppBundleStorage,
  VitestHostnameProvider,
} from '../builtin';

export class VitestApplicationContext implements IApplicationContext {
  env: IApplicationContext['env'];
  loaders: IApplicationContext['loaders'];
  reporter: IApplicationContext['reporter'];
  tracer: IApplicationContext['tracer'];
  mutator: IApplicationContext['mutator'];
  authz: IApplicationContext['authz'];
  repos: {
    App: VitestAggregator<App>,
    AppBundleUpload: VitestAggregator<AppBundleUpload>,
    CustomHost: VitestCustomHostRepository,
    UserProfile: VitestAggregator<UserProfile>,
  };
  services: {
    appBundleStorage: VitestAppBundleStorage,
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
    this.tracer = config.tracer ?? new NoopTracer();
    this.services = {
      appBundleStorage: new VitestAppBundleStorage(config),
      hostnameProvider: new VitestHostnameProvider(config),
    };
    const repoConfig = {
      newId: () => config.crypto.randomUUID(),
      vitestUtils: config.vitestUtils,
    };
    this.repos = {
      App: new VitestAggregator(repoConfig),
      AppBundleUpload: new VitestAggregator(repoConfig),
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
