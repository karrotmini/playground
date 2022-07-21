import {
  BundleTemplate,
} from '@karrotmini/playground-core/src/entities';
import {
  ResourceLoadingError,
} from '@karrotmini/playground-application/src/errors';
import {
  type AppDeploymentResolvers,
} from '@karrotmini/playground-application/src/__generated__/types';

export const AppDeployment: AppDeploymentResolvers = {
  name(deployment) {
    return deployment.name;
  },
  delployedAt(deployment) {
    return deployment.deployedAt;
  },
  async customHost(deployment, _args, { application }) {
    const customHost = await application.loaders.CustomHost.load(deployment.customHostId);
    if (!customHost) {
      throw new ResourceLoadingError({ typename: 'CustomHost', id: deployment.customHostId });
    }
    return customHost;
  },
  async bundle(deployment, _args, { application }) {
    switch (deployment.bundle.type) {
      case 'template': {
        return new BundleTemplate(deployment.bundle.id);
      }

      case 'upload': {
        const upload = await application.loaders.BundleUpload.load(deployment.bundle.id);
        if (!upload) {
          throw new ResourceLoadingError({ typename: 'BundleUpload', id: deployment.bundle.id });
        }
        return upload;
      }
    }
  },
};
