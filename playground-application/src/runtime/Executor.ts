import { type GraphQLSchema } from 'graphql';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  envelop,
  useSchema,
  type ExecuteFunction,
  type PluginOrDisabledPlugin,
} from '@envelop/core';

import typeDefs from '../__generated__/schema';
import { type IApplicationContext } from '../runtime';
import * as resolvers from '../resolvers';

import { type ExecutionResult } from './ExecutionResult';

export interface IExecutor {
  execute<
    ResponseData extends Record<string, unknown>,
    RequestVariables extends Record<string, unknown>,
  >(
    document: TypedDocumentNode<ResponseData, RequestVariables>,
    variables: RequestVariables,
  ): Promise<ExecutionResult<ResponseData>>;
}

type ConfigType<T> = T extends (config: infer U) => any ? U : never;
type TypeDefsConfig = ConfigType<typeof makeExecutableSchema>['typeDefs'];
type ResolversConfig = ConfigType<typeof makeExecutableSchema>['resolvers'];

export class Executor implements IExecutor {
  #context: IApplicationContext;
  #schema: GraphQLSchema;
  #execute: ExecuteFunction;

  constructor(config: {
    context: IApplicationContext,
    plugins?: PluginOrDisabledPlugin[],
    additionalTypeDefs?: TypeDefsConfig,
    additionalResolvers?: ResolversConfig,
  }) {
    this.#context = config.context;
    this.#schema = makeExecutableSchema({
      typeDefs: [typeDefs, config.additionalTypeDefs]
        .flatMap(v => v || []),
      resolvers: [resolvers, config.additionalResolvers]
        .flatMap(v => v || []) as ResolversConfig,
      resolverValidationOptions: {
        requireResolversForAllFields: 'error',
        requireResolversForResolveType: 'error',
      },
    });
    const getEnveloped = envelop({
      plugins: [
        useSchema(this.#schema),
        ...config.plugins || [],
      ],
    });
    const { execute } = getEnveloped();
    this.#execute = execute;
  }

  get context() {
    return this.#context;
  }

  get schema() {
    return this.#schema;
  }

  bindContext(context: IApplicationContext) {
    this.#context = context;
  }

  async execute<
    ResponseData extends Record<string, unknown>,
    RequestVariables extends Record<string, unknown>,
  >(
    document: TypedDocumentNode<ResponseData, RequestVariables>,
    variables: RequestVariables,
  ): Promise<ExecutionResult<ResponseData>> {
    const { data, errors } = await this.#execute({
      schema: this.#schema,
      document,
      variableValues: variables,
      contextValue: this.#context,
    });
    if (errors) {
      return {
        data: null,
        errors,
      };
    } else {
      return {
        data: data as any,
        errors: null,
      };
    }
  }
}
