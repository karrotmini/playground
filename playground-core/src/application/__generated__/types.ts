/* eslint-disable */
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { App as AppModel, AppManifest as AppManifestModel, AppBundle as AppBundleModel, AppBundleUpload as AppBundleUploadModel, AppBundleTemplate as AppBundleTemplateModel, CustomHost as CustomHostModel, UserProfile as UserProfileModel, HostnameProviderInfo as HostnameProviderInfoModel } from '../../entities';
import type { Root as RootModel } from '../resolvers/CreateUserProfileResult';
import type { IApplicationContext } from '../runtime/ApplicationContext';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
) => Promise<TResult> | TResult;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  URL: string;
};

export type App = Node & {
  currentBundle: AppBundle;
  customHost: CustomHost;
  id: Scalars['ID'];
  manifest: AppManifest;
  version: Scalars['Int'];
};

export type AppBundle = AppBundleTemplate | AppBundleUpload;

export type AppBundleTemplate = {
  id: Scalars['ID'];
};

export type AppBundleUpload = Node & {
  id: Scalars['ID'];
};

export type AppManifest = {
  icon: Scalars['URL'];
  name: Scalars['String'];
};

export type CreateAppInput = {
  appId: Scalars['String'];
  name: Scalars['String'];
  userProfileId: Scalars['ID'];
};

export type CreateAppResult = {
  app: App;
  customHost: CustomHost;
  userProfile: UserProfile;
};

export type CreateUserProfileInput = {
  _: InputMaybe<Scalars['String']>;
};

export type CreateUserProfileResult = {
  createApp: CreateUserProfileResultCreateAppResult;
  userProfile: UserProfile;
};


export type CreateUserProfileResultCreateAppArgs = {
  input: CreateUserProfileResultCreateAppInput;
};

export type CreateUserProfileResultCreateAppInput = {
  appId: Scalars['String'];
  name: Scalars['String'];
};

export type CreateUserProfileResultCreateAppResult = {
  app: App;
  customHost: CustomHost;
  userProfile: UserProfile;
};

export type CustomHost = Node & {
  id: Scalars['ID'];
  providerInfo: Maybe<HostnameProviderInfo>;
};

export type HostnameProviderInfo = {
  healthCheckUrl: Scalars['URL'];
  hostname: Scalars['String'];
  managementUrl: Scalars['URL'];
  url: Scalars['URL'];
};

export type Mutation = {
  createApp: CreateAppResult;
  createUserProfile: CreateUserProfileResult;
};


export type MutationCreateAppArgs = {
  input: CreateAppInput;
};


export type MutationCreateUserProfileArgs = {
  input?: CreateUserProfileInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type Query = {
  node: Maybe<Node>;
  userProfile: Maybe<UserProfile>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryUserProfileArgs = {
  id: Scalars['ID'];
};

export type UserProfile = Node & {
  apps: Array<App>;
  id: Scalars['ID'];
  name: Scalars['String'];
  profileImageUrl: Scalars['URL'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  App: ResolverTypeWrapper<AppModel>;
  AppBundle: ResolverTypeWrapper<AppBundleModel>;
  AppBundleTemplate: ResolverTypeWrapper<AppBundleTemplateModel>;
  AppBundleUpload: ResolverTypeWrapper<AppBundleUploadModel>;
  AppManifest: ResolverTypeWrapper<AppManifestModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateAppInput: CreateAppInput;
  CreateAppResult: ResolverTypeWrapper<Omit<CreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversTypes['App'], customHost: ResolversTypes['CustomHost'], userProfile: ResolversTypes['UserProfile'] }>;
  CreateUserProfileInput: CreateUserProfileInput;
  CreateUserProfileResult: ResolverTypeWrapper<RootModel>;
  CreateUserProfileResultCreateAppInput: CreateUserProfileResultCreateAppInput;
  CreateUserProfileResultCreateAppResult: ResolverTypeWrapper<Omit<CreateUserProfileResultCreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversTypes['App'], customHost: ResolversTypes['CustomHost'], userProfile: ResolversTypes['UserProfile'] }>;
  CustomHost: ResolverTypeWrapper<CustomHostModel>;
  HostnameProviderInfo: ResolverTypeWrapper<HostnameProviderInfoModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['App'] | ResolversTypes['AppBundleUpload'] | ResolversTypes['CustomHost'] | ResolversTypes['UserProfile'];
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  URL: ResolverTypeWrapper<Scalars['URL']>;
  UserProfile: ResolverTypeWrapper<UserProfileModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  App: AppModel;
  AppBundle: AppBundleModel;
  AppBundleTemplate: AppBundleTemplateModel;
  AppBundleUpload: AppBundleUploadModel;
  AppManifest: AppManifestModel;
  Boolean: Scalars['Boolean'];
  CreateAppInput: CreateAppInput;
  CreateAppResult: Omit<CreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversParentTypes['App'], customHost: ResolversParentTypes['CustomHost'], userProfile: ResolversParentTypes['UserProfile'] };
  CreateUserProfileInput: CreateUserProfileInput;
  CreateUserProfileResult: RootModel;
  CreateUserProfileResultCreateAppInput: CreateUserProfileResultCreateAppInput;
  CreateUserProfileResultCreateAppResult: Omit<CreateUserProfileResultCreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversParentTypes['App'], customHost: ResolversParentTypes['CustomHost'], userProfile: ResolversParentTypes['UserProfile'] };
  CustomHost: CustomHostModel;
  HostnameProviderInfo: HostnameProviderInfoModel;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Node: ResolversParentTypes['App'] | ResolversParentTypes['AppBundleUpload'] | ResolversParentTypes['CustomHost'] | ResolversParentTypes['UserProfile'];
  Query: {};
  String: Scalars['String'];
  URL: Scalars['URL'];
  UserProfile: UserProfileModel;
};

export type AppResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  currentBundle: Resolver<ResolversTypes['AppBundle'], ParentType, ContextType>;
  customHost: Resolver<ResolversTypes['CustomHost'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  manifest: Resolver<ResolversTypes['AppManifest'], ParentType, ContextType>;
  version: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppBundleResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['AppBundle'] = ResolversParentTypes['AppBundle']> = {
  __resolveType: TypeResolveFn<'AppBundleTemplate' | 'AppBundleUpload', ParentType, ContextType>;
};

export type AppBundleTemplateResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['AppBundleTemplate'] = ResolversParentTypes['AppBundleTemplate']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppBundleUploadResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['AppBundleUpload'] = ResolversParentTypes['AppBundleUpload']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppManifestResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['AppManifest'] = ResolversParentTypes['AppManifest']> = {
  icon: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAppResultResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['CreateAppResult'] = ResolversParentTypes['CreateAppResult']> = {
  app: Resolver<ResolversTypes['App'], ParentType, ContextType>;
  customHost: Resolver<ResolversTypes['CustomHost'], ParentType, ContextType>;
  userProfile: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserProfileResultResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['CreateUserProfileResult'] = ResolversParentTypes['CreateUserProfileResult']> = {
  createApp: Resolver<ResolversTypes['CreateUserProfileResultCreateAppResult'], ParentType, ContextType, RequireFields<CreateUserProfileResultCreateAppArgs, 'input'>>;
  userProfile: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserProfileResultCreateAppResultResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['CreateUserProfileResultCreateAppResult'] = ResolversParentTypes['CreateUserProfileResultCreateAppResult']> = {
  app: Resolver<ResolversTypes['App'], ParentType, ContextType>;
  customHost: Resolver<ResolversTypes['CustomHost'], ParentType, ContextType>;
  userProfile: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomHostResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['CustomHost'] = ResolversParentTypes['CustomHost']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  providerInfo: Resolver<Maybe<ResolversTypes['HostnameProviderInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostnameProviderInfoResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['HostnameProviderInfo'] = ResolversParentTypes['HostnameProviderInfo']> = {
  healthCheckUrl: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  hostname: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  managementUrl: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  url: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createApp: Resolver<ResolversTypes['CreateAppResult'], ParentType, ContextType, RequireFields<MutationCreateAppArgs, 'input'>>;
  createUserProfile: Resolver<ResolversTypes['CreateUserProfileResult'], ParentType, ContextType, RequireFields<MutationCreateUserProfileArgs, 'input'>>;
};

export type NodeResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'App' | 'AppBundleUpload' | 'CustomHost' | 'UserProfile', ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  userProfile: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType, RequireFields<QueryUserProfileArgs, 'id'>>;
};

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export type UserProfileResolvers<ContextType = IApplicationContext, ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']> = {
  apps: Resolver<Array<ResolversTypes['App']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profileImageUrl: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = IApplicationContext> = {
  App: AppResolvers<ContextType>;
  AppBundle: AppBundleResolvers<ContextType>;
  AppBundleTemplate: AppBundleTemplateResolvers<ContextType>;
  AppBundleUpload: AppBundleUploadResolvers<ContextType>;
  AppManifest: AppManifestResolvers<ContextType>;
  CreateAppResult: CreateAppResultResolvers<ContextType>;
  CreateUserProfileResult: CreateUserProfileResultResolvers<ContextType>;
  CreateUserProfileResultCreateAppResult: CreateUserProfileResultCreateAppResultResolvers<ContextType>;
  CustomHost: CustomHostResolvers<ContextType>;
  HostnameProviderInfo: HostnameProviderInfoResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Node: NodeResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  URL: GraphQLScalarType;
  UserProfile: UserProfileResolvers<ContextType>;
};

