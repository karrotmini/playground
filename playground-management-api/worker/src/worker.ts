import { type DocumentNode } from 'graphql';
import { Router, compose } from 'worktop';
import { reply } from 'worktop/response';
import * as CORS from 'worktop/cors';
import { start } from 'worktop/cfw';
import * as Cache from 'worktop/cfw.cache';
import { makeJsonDecoder } from '@urlpack/json';

import {
  Executor,
  ConsoleReporter,
  NoopEventBus,
  makeApplicationContext,
} from '@karrotmini/playground-application/src';
import {
  AppRepository,
  BundleUploadRepository,
  CustomHostRepository,
  UserProfileRepository,
} from '@karrotmini/playground-cloudflare-adapter/src';
import {
  CloudflareHostnameProvider,
} from '@karrotmini/cloudflare-hostname-provider/src';

import typeDefs from './__generated__/schema';
import * as resolvers from './resolvers';
import { type Context } from './context';
import * as Gateway from './gateway';
import * as Authz from './authorization';

import {
  IssueAppCredentialDocument,
  IssueUserProfileCredentialDocument,
} from './usecases';

const operationDict: Record<string, DocumentNode | undefined> = {
  IssueAppCredential: IssueAppCredentialDocument,
  IssueUserProfileCredential: IssueUserProfileCredentialDocument,
};

const API = new Router<Context>();

API.prepare = compose(
  CORS.preflight(),
  Gateway.trust(),
  Authz.permit(),
  Cache.sync(),
);

API.add('POST', '/api/graphql/:operation', async (req, ctx) => {
  const applicationContext = makeApplicationContext({
    env: {
      crypto,
      vars: {
        HOSTNAME_PATTERN: ctx.bindings.HOSTNAME_PATTERN,
      },
      secrets: {
        CREDENTIAL_SECRET: ctx.bindings.CREDENTIAL_SECRET,
      },
    },
    services: {
      hostnameProvider: new CloudflareHostnameProvider({
        fetch,
        zoneId: ctx.bindings.CLOUDFLARE_CUSTOMHOST_ZONE_ID,
        apiToken: ctx.bindings.CLOUDFLARE_CUSTOMHOST_ZONE_MANAGEMENT_KEY,
      }),
    },
    repos: {
      App: new AppRepository({ service: ctx.bindings.playground }),
      BundleUpload: new BundleUploadRepository({ service: ctx.bindings.playground }),
      CustomHost: new CustomHostRepository({ service: ctx.bindings.playground }),
      UserProfile: new UserProfileRepository({ service: ctx.bindings.playground }),
    },
    reporter: new ConsoleReporter(console),
    eventBus: new NoopEventBus(),
    authz: ctx.authz,
  });

  const executor = new Executor({
    context: applicationContext,
    additionalTypeDefs: typeDefs,
    additionalResolvers: resolvers,
  });

  const operation = operationDict[ctx.params.operation];
  if (!operation) {
    return reply(404, 'Unknown operation');
  }

  const variablesParam = new URL(req.url).searchParams.get('variables');
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
