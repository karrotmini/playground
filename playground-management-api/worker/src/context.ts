import {
  type Handler,
  type Context as WorktopContext,
} from 'worktop';
import {
  makeApplicationContext,
  NoopEventBus,
  ConsoleReporter,
  type IExecutorContext,
  type IResourceAuthorizer,
} from '@karrotmini/playground-application/src';
import {
  AppRepository,
  BundleUploadRepository,
  CustomHostRepository,
  UserProfileRepository,
} from '@karrotmini/playground-cloudflare-adapter/src';
import {
  CloudflareHostnameProvider,
} from '@karrotmini/cloudflare-hostname-provider/src';
import {
  PlaygroundBundleStorage,
} from './adapters/PlaygroundBundleStorage';

export interface WorkerContext extends WorktopContext, IExecutorContext {
  bindings: WranglerEnv,
  authz: IResourceAuthorizer,
};

export type T = WorkerContext;

export function setup(): Handler<WorkerContext> {
  return async function(_request, context) {
    const { authz, bindings } = context;

    const applicationContext = makeApplicationContext({
      // Should be injected before
      authz,

      env: {
        crypto,
        vars: {
          HOSTNAME_PATTERN: bindings.HOSTNAME_PATTERN,
        },
        secrets: {
          CREDENTIAL_SECRET: bindings.CREDENTIAL_SECRET,
        },
      },

      services: {
        bundleStorage: new PlaygroundBundleStorage({
          service: bindings.bundleStorage,
        }),
        hostnameProvider: new CloudflareHostnameProvider({
          fetch,
          zoneId: bindings.CLOUDFLARE_CUSTOMHOST_ZONE_ID,
          apiToken: bindings.CLOUDFLARE_CUSTOMHOST_ZONE_MANAGEMENT_KEY,
        }),
      },

      repos: {
        App: new AppRepository({
          service: bindings.playground,
        }),
        BundleUpload: new BundleUploadRepository({
          service: bindings.playground
        }),
        CustomHost: new CustomHostRepository({
          service: bindings.playground,
        }),
        UserProfile: new UserProfileRepository({
          service: bindings.playground,
        }),
      },
      reporter: new ConsoleReporter(console),
      eventBus: new NoopEventBus(),
    });

    context.application = applicationContext;
  }
}
