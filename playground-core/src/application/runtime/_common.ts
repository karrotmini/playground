import type DataLoader from 'dataloader';
import {
  type EntityID,
  type Aggregator,
} from '../../framework';
import {
  type IAppBundleStorage,
  type IHostnameProvider,
  type IAppRepository,
  type IAppBundleUploadRepository,
  type ICustomHostRepository,
  type IUserProfileRepository,
} from '../ports';

export type Repositories = {
  App: IAppRepository,
  AppBundleUpload: IAppBundleUploadRepository,
  CustomHost: ICustomHostRepository,
  UserProfile: IUserProfileRepository,
};

export type RepositoryName = keyof Repositories;
export type Repository = Repositories[RepositoryName];

export type RepositoryLoaders = {
  [K in RepositoryName]: (
    Repositories[K] extends Aggregator<infer Aggregate>
      ? DataLoader<EntityID<Aggregate>, Aggregate | null, string>
      : never
  )
};
export type RepositoryLoader = RepositoryLoaders[RepositoryName];

export type Services = {
  appBundleStorage: IAppBundleStorage,
  hostnameProvider: IHostnameProvider,
};
