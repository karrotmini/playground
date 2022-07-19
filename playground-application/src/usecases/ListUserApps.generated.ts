/* eslint-disable */
import type * as Types from '../__generated__/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppCardFragment = { __typename: 'App', id: string, manifest: { __typename: 'AppManifest', name: string, icon: string }, canonicalHost: { __typename: 'CustomHost', providerInfo: { __typename: 'HostnameProviderInfo', url: string } } };

export type ListUserAppsQueryVariables = Types.Exact<{
  userProfileId: Types.Scalars['ID'];
}>;


export type ListUserAppsQuery = { __typename: 'Query', userProfile: { __typename: 'UserProfile', apps: Array<{ __typename: 'App', id: string, manifest: { __typename: 'AppManifest', name: string, icon: string }, canonicalHost: { __typename: 'CustomHost', providerInfo: { __typename: 'HostnameProviderInfo', url: string } } }> } | null };

export const AppCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"App"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"manifest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canonicalHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"providerInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<AppCardFragment, unknown>;
export const ListUserAppsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListUserApps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppCard"}}]}}]}}]}},...AppCardFragmentDoc.definitions]} as unknown as DocumentNode<ListUserAppsQuery, ListUserAppsQueryVariables>;