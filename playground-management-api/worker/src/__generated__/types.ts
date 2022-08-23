/* eslint-disable */
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { App as AppType, DeploymentRef as DeploymentRefType, AppManifest as AppManifestType, Bundle as BundleType, BundleUpload as BundleUploadType, BundleTemplate as BundleTemplateType, CustomHost as CustomHostType, UserProfile as UserProfileType, HostnameProviderInfo as HostnameProviderInfoType } from '@karrotmini/playground-core/src/entities';
import type { WorkerContext } from '@karrotmini/playground-management-api-worker/src/context';
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
  DateTime: Date | string | number;
  URL: URL | string;
};

export type App = Node & {
  canonicalHost: CustomHost;
  deployments: Array<AppDeployment>;
  id: Scalars['ID'];
  liveDeployment: Maybe<AppDeployment>;
  manifest: AppManifest;
};

export type AppDeployment = {
  bundle: Bundle;
  customHost: CustomHost;
  delployedAt: Scalars['DateTime'];
  name: Scalars['String'];
};

export type AppManifest = {
  icon: Scalars['URL'];
  name: Scalars['String'];
};

export type AppPermision =
  | 'ADMIN'
  | 'READ'
  | 'WRITE';

export type Bundle = BundleTemplate | BundleUpload;

export type BundleTemplate = Node & {
  id: Scalars['ID'];
};

export type BundleUpload = Node & {
  id: Scalars['ID'];
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
  providerInfo: HostnameProviderInfo;
};

export type HostnameProviderInfo = {
  healthCheckUrl: Scalars['URL'];
  hostname: Scalars['String'];
  managementUrl: Scalars['URL'];
  url: Scalars['URL'];
};

export type IssueAppCredentialInput = {
  appId: Scalars['ID'];
  permission: AppPermision;
};

export type IssueAppCredentialResult = {
  credential: Scalars['String'];
};

export type IssueUserProfileCredentialInput = {
  permission: UserProfilePermision;
  userProfileId: Scalars['ID'];
};

export type IssueUserProfileCredentialResult = {
  credential: Scalars['String'];
};

export type Mutation = {
  createApp: CreateAppResult;
  createUserProfile: CreateUserProfileResult;
  issueAppCredential: IssueAppCredentialResult;
  issueUserProfileCredential: IssueUserProfileCredentialResult;
};


export type MutationCreateAppArgs = {
  input: CreateAppInput;
};


export type MutationCreateUserProfileArgs = {
  input?: CreateUserProfileInput;
};


export type MutationIssueAppCredentialArgs = {
  input: IssueAppCredentialInput;
};


export type MutationIssueUserProfileCredentialArgs = {
  input: IssueUserProfileCredentialInput;
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

export type UserProfilePermision =
  | 'ADMIN'
  | 'READ'
  | 'WRITE';



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
  App: ResolverTypeWrapper<AppType>;
  AppDeployment: ResolverTypeWrapper<DeploymentRefType>;
  AppManifest: ResolverTypeWrapper<AppManifestType>;
  AppPermision: AppPermision;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bundle: ResolverTypeWrapper<BundleType>;
  BundleTemplate: ResolverTypeWrapper<BundleTemplateType>;
  BundleUpload: ResolverTypeWrapper<BundleUploadType>;
  CreateAppInput: CreateAppInput;
  CreateAppResult: ResolverTypeWrapper<Omit<CreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversTypes['App'], customHost: ResolversTypes['CustomHost'], userProfile: ResolversTypes['UserProfile'] }>;
  CreateUserProfileInput: CreateUserProfileInput;
  CreateUserProfileResult: ResolverTypeWrapper<Omit<CreateUserProfileResult, 'createApp' | 'userProfile'> & { createApp: ResolversTypes['CreateUserProfileResultCreateAppResult'], userProfile: ResolversTypes['UserProfile'] }>;
  CreateUserProfileResultCreateAppInput: CreateUserProfileResultCreateAppInput;
  CreateUserProfileResultCreateAppResult: ResolverTypeWrapper<Omit<CreateUserProfileResultCreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversTypes['App'], customHost: ResolversTypes['CustomHost'], userProfile: ResolversTypes['UserProfile'] }>;
  CustomHost: ResolverTypeWrapper<CustomHostType>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  HostnameProviderInfo: ResolverTypeWrapper<HostnameProviderInfoType>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IssueAppCredentialInput: ResolverTypeWrapper<IssueAppCredentialInput>;
  IssueAppCredentialResult: ResolverTypeWrapper<IssueAppCredentialResult>;
  IssueUserProfileCredentialInput: ResolverTypeWrapper<IssueUserProfileCredentialInput>;
  IssueUserProfileCredentialResult: ResolverTypeWrapper<IssueUserProfileCredentialResult>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['App'] | ResolversTypes['BundleTemplate'] | ResolversTypes['BundleUpload'] | ResolversTypes['CustomHost'] | ResolversTypes['UserProfile'];
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  URL: ResolverTypeWrapper<Scalars['URL']>;
  UserProfile: ResolverTypeWrapper<UserProfileType>;
  UserProfilePermision: UserProfilePermision;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  App: AppType;
  AppDeployment: DeploymentRefType;
  AppManifest: AppManifestType;
  Boolean: Scalars['Boolean'];
  Bundle: BundleType;
  BundleTemplate: BundleTemplateType;
  BundleUpload: BundleUploadType;
  CreateAppInput: CreateAppInput;
  CreateAppResult: Omit<CreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversParentTypes['App'], customHost: ResolversParentTypes['CustomHost'], userProfile: ResolversParentTypes['UserProfile'] };
  CreateUserProfileInput: CreateUserProfileInput;
  CreateUserProfileResult: Omit<CreateUserProfileResult, 'createApp' | 'userProfile'> & { createApp: ResolversParentTypes['CreateUserProfileResultCreateAppResult'], userProfile: ResolversParentTypes['UserProfile'] };
  CreateUserProfileResultCreateAppInput: CreateUserProfileResultCreateAppInput;
  CreateUserProfileResultCreateAppResult: Omit<CreateUserProfileResultCreateAppResult, 'app' | 'customHost' | 'userProfile'> & { app: ResolversParentTypes['App'], customHost: ResolversParentTypes['CustomHost'], userProfile: ResolversParentTypes['UserProfile'] };
  CustomHost: CustomHostType;
  DateTime: Scalars['DateTime'];
  HostnameProviderInfo: HostnameProviderInfoType;
  ID: Scalars['ID'];
  IssueAppCredentialInput: IssueAppCredentialInput;
  IssueAppCredentialResult: IssueAppCredentialResult;
  IssueUserProfileCredentialInput: IssueUserProfileCredentialInput;
  IssueUserProfileCredentialResult: IssueUserProfileCredentialResult;
  Mutation: {};
  Node: ResolversParentTypes['App'] | ResolversParentTypes['BundleTemplate'] | ResolversParentTypes['BundleUpload'] | ResolversParentTypes['CustomHost'] | ResolversParentTypes['UserProfile'];
  Query: {};
  String: Scalars['String'];
  URL: Scalars['URL'];
  UserProfile: UserProfileType;
};

export type AppResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  canonicalHost: Resolver<ResolversTypes['CustomHost'], ParentType, ContextType>;
  deployments: Resolver<Array<ResolversTypes['AppDeployment']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liveDeployment: Resolver<Maybe<ResolversTypes['AppDeployment']>, ParentType, ContextType>;
  manifest: Resolver<ResolversTypes['AppManifest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppDeploymentResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['AppDeployment'] = ResolversParentTypes['AppDeployment']> = {
  bundle: Resolver<ResolversTypes['Bundle'], ParentType, ContextType>;
  customHost: Resolver<ResolversTypes['CustomHost'], ParentType, ContextType>;
  delployedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppManifestResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['AppManifest'] = ResolversParentTypes['AppManifest']> = {
  icon: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BundleResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['Bundle'] = ResolversParentTypes['Bundle']> = {
  __resolveType: TypeResolveFn<'BundleTemplate' | 'BundleUpload', ParentType, ContextType>;
};

export type BundleTemplateResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['BundleTemplate'] = ResolversParentTypes['BundleTemplate']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BundleUploadResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['BundleUpload'] = ResolversParentTypes['BundleUpload']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAppResultResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['CreateAppResult'] = ResolversParentTypes['CreateAppResult']> = {
  app: Resolver<ResolversTypes['App'], ParentType, ContextType>;
  customHost: Resolver<ResolversTypes['CustomHost'], ParentType, ContextType>;
  userProfile: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserProfileResultResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['CreateUserProfileResult'] = ResolversParentTypes['CreateUserProfileResult']> = {
  createApp: Resolver<ResolversTypes['CreateUserProfileResultCreateAppResult'], ParentType, ContextType, RequireFields<CreateUserProfileResultCreateAppArgs, 'input'>>;
  userProfile: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserProfileResultCreateAppResultResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['CreateUserProfileResultCreateAppResult'] = ResolversParentTypes['CreateUserProfileResultCreateAppResult']> = {
  app: Resolver<ResolversTypes['App'], ParentType, ContextType>;
  customHost: Resolver<ResolversTypes['CustomHost'], ParentType, ContextType>;
  userProfile: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomHostResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['CustomHost'] = ResolversParentTypes['CustomHost']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  providerInfo: Resolver<ResolversTypes['HostnameProviderInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type HostnameProviderInfoResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['HostnameProviderInfo'] = ResolversParentTypes['HostnameProviderInfo']> = {
  healthCheckUrl: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  hostname: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  managementUrl: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  url: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IssueAppCredentialInputResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['IssueAppCredentialInput'] = ResolversParentTypes['IssueAppCredentialInput']> = {
  appId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permission: Resolver<ResolversTypes['AppPermision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IssueAppCredentialResultResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['IssueAppCredentialResult'] = ResolversParentTypes['IssueAppCredentialResult']> = {
  credential: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IssueUserProfileCredentialInputResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['IssueUserProfileCredentialInput'] = ResolversParentTypes['IssueUserProfileCredentialInput']> = {
  permission: Resolver<ResolversTypes['UserProfilePermision'], ParentType, ContextType>;
  userProfileId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IssueUserProfileCredentialResultResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['IssueUserProfileCredentialResult'] = ResolversParentTypes['IssueUserProfileCredentialResult']> = {
  credential: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createApp: Resolver<ResolversTypes['CreateAppResult'], ParentType, ContextType, RequireFields<MutationCreateAppArgs, 'input'>>;
  createUserProfile: Resolver<ResolversTypes['CreateUserProfileResult'], ParentType, ContextType, RequireFields<MutationCreateUserProfileArgs, 'input'>>;
  issueAppCredential: Resolver<ResolversTypes['IssueAppCredentialResult'], ParentType, ContextType, RequireFields<MutationIssueAppCredentialArgs, 'input'>>;
  issueUserProfileCredential: Resolver<ResolversTypes['IssueUserProfileCredentialResult'], ParentType, ContextType, RequireFields<MutationIssueUserProfileCredentialArgs, 'input'>>;
};

export type NodeResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'App' | 'BundleTemplate' | 'BundleUpload' | 'CustomHost' | 'UserProfile', ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  userProfile: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType, RequireFields<QueryUserProfileArgs, 'id'>>;
};

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export type UserProfileResolvers<ContextType = WorkerContext, ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']> = {
  apps: Resolver<Array<ResolversTypes['App']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profileImageUrl: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = WorkerContext> = {
  App: AppResolvers<ContextType>;
  AppDeployment: AppDeploymentResolvers<ContextType>;
  AppManifest: AppManifestResolvers<ContextType>;
  Bundle: BundleResolvers<ContextType>;
  BundleTemplate: BundleTemplateResolvers<ContextType>;
  BundleUpload: BundleUploadResolvers<ContextType>;
  CreateAppResult: CreateAppResultResolvers<ContextType>;
  CreateUserProfileResult: CreateUserProfileResultResolvers<ContextType>;
  CreateUserProfileResultCreateAppResult: CreateUserProfileResultCreateAppResultResolvers<ContextType>;
  CustomHost: CustomHostResolvers<ContextType>;
  DateTime: GraphQLScalarType;
  HostnameProviderInfo: HostnameProviderInfoResolvers<ContextType>;
  IssueAppCredentialInput: IssueAppCredentialInputResolvers<ContextType>;
  IssueAppCredentialResult: IssueAppCredentialResultResolvers<ContextType>;
  IssueUserProfileCredentialInput: IssueUserProfileCredentialInputResolvers<ContextType>;
  IssueUserProfileCredentialResult: IssueUserProfileCredentialResultResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Node: NodeResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  URL: GraphQLScalarType;
  UserProfile: UserProfileResolvers<ContextType>;
};

