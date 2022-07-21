import { type DocumentNode } from 'graphql';
import { Router, compose } from 'worktop';
import { reply } from 'worktop/response';
import * as CORS from 'worktop/cors';
import { start } from 'worktop/cfw';
import * as Cache from 'worktop/cfw.cache';
import { makeJsonDecoder } from '@urlpack/json';
import { Executor } from '@karrotmini/playground-application/src';

import * as Context from './context';
import * as Gateway from './gateway';
import * as Authz from './authorization';

import typeDefs from './__generated__/schema';
import * as resolvers from './resolvers';
import {
  IssueAppCredentialDocument,
  IssueUserProfileCredentialDocument,
} from './usecases';

const operationDict: Record<string, DocumentNode | undefined> = {
  IssueAppCredential: IssueAppCredentialDocument,
  IssueUserProfileCredential: IssueUserProfileCredentialDocument,
};

const API = new Router<Context.T>();

API.prepare = compose(
  CORS.preflight(),
  Gateway.trust(),
  Authz.permit(),
  Context.setup(),
  Cache.sync(),
);

API.add('POST', '/api/graphql/:operation', async (request, context) => {
  const executor = new Executor({
    context,
    additionalTypeDefs: typeDefs,
    additionalResolvers: resolvers,
  });

  const operation = operationDict[context.params.operation];
  if (!operation) {
    return reply(404, 'Unknown operation');
  }

  const variablesParam = new URL(request.url).searchParams.get('variables');
  if (!variablesParam) {
    return reply(400, 'Missing variables');
  }

  const decoder = makeJsonDecoder<unknown>();
  try {
    var variables = decoder.decode(variablesParam) as Record<string, unknown>;
  } catch {
    return reply(400, 'Invalid variables');
  }
  if (!variables || typeof variables !== 'object') {
    return reply(400, 'Invalid variables');
  }

  const result = await executor.execute(operation, variables);
  return reply(200, result);
});

export default start(API.run);
