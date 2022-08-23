/* eslint-disable */
import type * as Types from '../__generated__/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type IssueAppCredentialMutationVariables = Types.Exact<{
  appId: Types.InputMaybe<Types.Scalars['ID']>;
  permission: Types.AppPermision;
}>;


export type IssueAppCredentialMutation = { __typename: 'Mutation', issueAppCredential: { __typename: 'IssueAppCredentialResult', credential: string } };


export const IssueAppCredentialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IssueAppCredential"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permission"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppPermision"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issueAppCredential"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"appId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"permission"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permission"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credential"}}]}}]}}]} as unknown as DocumentNode<IssueAppCredentialMutation, IssueAppCredentialMutationVariables>;