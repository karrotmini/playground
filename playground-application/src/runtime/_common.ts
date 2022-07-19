import type DataLoader from 'dataloader';
import {
  type EntityID,
  type Aggregator,
} from '@karrotmini/playground-core/src/framework';
import {
  type IBundleStorage,
  type IHostnameProvider,
  type IAppRepository,
  type IBundleUploadRepository,
  type ICustomHostRepository,
  type IUserProfileRepository,
} from '../ports';

export type Repositories = Readonly<{
  App: IAppRepository,
  BundleUpload: IBundleUploadRepository,
  CustomHost: ICustomHostRepository,
  UserProfile: IUserProfileRepository,
}>;

export type RepositoryName = keyof Repositories;
export type Repository = Repositories[RepositoryName];

export type RepositoryLoaders = Readonly<{
  [K in RepositoryName]: (
    Repositories[K] extends Aggregator<infer Aggregate>
      ? DataLoader<EntityID<Aggregate>, Aggregate | null, string>
      : never
  )
}>;
export type RepositoryLoader = RepositoryLoaders[RepositoryName];

export type Services = Readonly<{
  bundleStorage: IBundleStorage,
  hostnameProvider: IHostnameProvider,
}>;
