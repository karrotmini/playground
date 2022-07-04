/* eslint-disable */
import type * as Types from '../__generated__/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateUserProfileMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateUserProfileMutation = { __typename: 'Mutation', createUserProfile: { __typename: 'CreateUserProfileResult', userProfile: { __typename: 'UserProfile', id: string } } };


export const CreateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserProfileMutation, CreateUserProfileMutationVariables>;