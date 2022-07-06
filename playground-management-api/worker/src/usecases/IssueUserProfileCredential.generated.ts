/* eslint-disable */
import type * as Types from '../__generated__/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type IssueUserProfileCredentialMutationVariables = Types.Exact<{
  userProfileId: Types.InputMaybe<Types.Scalars['ID']>;
  permission: Types.UserProfilePermision;
}>;


export type IssueUserProfileCredentialMutation = { __typename: 'Mutation', issueUserProfileCredential: { __typename: 'IssueUserProfileCredentialResult', credential: string, userProfile: { __typename: 'UserProfile', id: string } } };


export const IssueUserProfileCredentialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IssueUserProfileCredential"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permission"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfilePermision"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issueUserProfileCredential"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userProfileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"permission"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permission"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credential"}},{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<IssueUserProfileCredentialMutation, IssueUserProfileCredentialMutationVariables>;