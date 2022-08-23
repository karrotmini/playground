/* eslint-disable */
import type * as Types from '../__generated__/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UserProfileByIdQueryVariables = Types.Exact<{
  userProfileId: Types.Scalars['ID'];
}>;


export type UserProfileByIdQuery = { __typename: 'Query', userProfile: { __typename: 'UserProfile', id: string, name: string, profileImageUrl: URL | string } | null };


export const UserProfileByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserProfileById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]} as unknown as DocumentNode<UserProfileByIdQuery, UserProfileByIdQueryVariables>;