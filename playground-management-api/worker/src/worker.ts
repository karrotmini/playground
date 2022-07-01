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
} from '@karrotmini/playground-core/src';
import {
  AppRepository,
  AppBundleUploadRepository,
  CustomHostRepository,
  UserProfileRepository,
} from '@karrotmini/playground-cloudflare-adapter/src';
import {
  CloudflareHostnameProvider,
} from '@karrotmini/cloudflare-hostname-provider/src';

import { type Context } from './context';
import * as Authorization from './authorization';

const API = new Router<Context>();

API.prepare = compose(
  CORS.preflight(),
  Authorization.permit(),
  Cache.sync(),
);

API.add('POST', '/api/graphql/:operation', async (req, ctx) => {
  const pattern = /Playground-Management-Key (?<key>\w+)/i;
  const header = req.headers.get('Authorization');
  const authorization = header?.match(pattern)?.groups?.key;
  if (!authorization || authorization !== ctx.bindings.MANAGEMENT_KEY) {
    return reply(401, 'operation not permitted');
  }

  const applicationContext = makeApplicationContext({
    env: {
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
      AppBundleUpload: new AppBundleUploadRepository({ service: ctx.bindings.playground }),
      CustomHost: new CustomHostRepository({ service: ctx.bindings.playground }),
      UserProfile: new UserProfileRepository({ service: ctx.bindings.playground }),
    },
    reporter: new ConsoleReporter(console),
    eventBus: new NoopEventBus(),
    authz: ctx.authz,
  });

  const executor = new Executor({
    context: applicationContext,
  });

  const operation = {
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
    IssueUserProfileCredential: IssueUserProfileCredentialDocument,
  }[ctx.params.operation];

  if (!operation) {
    return reply(404, 'Unknown operation');
  }

  const variablesParam = new URL(req.url).searchParams.get('variables');
  if (!variablesParam) {
    return reply(400, 'Missing variables');
  }

  const decoder = makeJsonDecoder<unknown>();
  try {
    var variables = decoder.decode(variablesParam);
  } catch {
    return reply(400, 'Invalid variables');
  }
  if (!variables || typeof variables !== 'object') {
    return reply(400, 'Invalid variables');
  }

  const result = await executor.execute(
    operation,
    variables as Record<string, unknown>,
  );

  return reply(200, result);
});

export default start(API.run);
