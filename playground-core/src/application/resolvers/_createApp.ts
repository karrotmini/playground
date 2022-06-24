import {
  App,
  AppBundleTemplate,
  AppIcon,
  AppManifest,
  CustomHost,
  UserProfile,
} from '../../entities';
import {
  HostnameAlreadyUsedError,
  HostnameNotAvailableError,
} from '../../errors';
import {
  createRandomColor,
} from '../../utils';
import {
  type IApplicationContext,
} from '../runtime';

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
  const appId = repos.App.newId();

  let customHost: CustomHost | null = await repos.CustomHost.queryByHostname(hostname);
  if (customHost?.connectedAppId) {
    throw new HostnameAlreadyUsedError(hostname);
  } else if (!customHost) {
    const customHostId = repos.CustomHost.newId();
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
  const template = AppBundleTemplate.centeringDiv();
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
