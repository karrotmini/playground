import {
  App,
  BundleTemplate,
  AppIcon,
  AppManifest,
  CustomHost,
  UserProfile,
} from '@karrotmini/playground-core/src/entities';
import {
  HostnameAlreadyUsedError,
  HostnameNotAvailableError,
} from '@karrotmini/playground-core/src/errors';
import {
  createRandomColor,
} from '@karrotmini/playground-core/src/utils';
import {
  type IApplicationContext,
} from '@karrotmini/playground-application/src/runtime';

export async function createApp(
  root: {
    userProfile: UserProfile,
  },
  args: {
    input: {
      name: string,
      appId: string,
    },
  },
  {
    env,
    repos,
    services,
  }: IApplicationContext,
) {
  const { userProfile } = root;

  const manifestAppId = args.input.appId;
  const hostname = env.vars.HOSTNAME_PATTERN.replace('*', manifestAppId);
  const appId = await repos.App.newId();

  let customHost: CustomHost | null = await repos.CustomHost.queryByHostname(hostname);
  if (customHost?.connectedAppId) {
    throw new HostnameAlreadyUsedError(hostname);
  } else if (!customHost) {
    const customHostId = await repos.CustomHost.newId();
    const providerInfo = await services.hostnameProvider.searchHostname({ hostname }) ??
      await services.hostnameProvider.createHostname({ hostname });
    if (!providerInfo) {
      throw new HostnameNotAvailableError(hostname);
    }
    customHost = CustomHost.createWithProviderInfo({
      id: customHostId,
      providerInfo,
    });
  }
  if (!customHost) {
    throw new HostnameNotAvailableError(hostname);
  }

  const appIcon = AppIcon.createFallbackSVG({
    size: 100,
    text: args.input.name,
    color: [
      createRandomColor(Math.random),
      createRandomColor(Math.random),
    ],
  });
  const manifest = new AppManifest({
    appId: manifestAppId,
    name: args.input.name,
    icon: appIcon.toString(),
  });
  const template = BundleTemplate.centeringDiv();
  const app = App.createFromTemplate({
    id: appId,
    ownerId: userProfile.id,
    customHostId: customHost.id,
    manifest,
    template,
  });

  userProfile.addApp({ appId });
  customHost.connect({ appId });

  return {
    userProfile,
    customHost,
    app,
  };
}
