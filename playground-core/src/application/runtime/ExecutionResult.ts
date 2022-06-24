import { type GraphQLError } from 'graphql';

export type ExecutionResult<ResponseData extends Record<string, unknown>> = (
  | { data: ResponseData, errors: null }
  | { data: null, errors: readonly GraphQLError[] }
);
