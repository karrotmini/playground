import {
  type Handler,
} from 'worktop';
import {
  AuthorizationError,
  PlaygroundResourceAuthorizer,
  type AuthorizationState,
} from '@karrotmini/playground-application/src';

import { type Context } from './context';
import * as Credential from './credential';

export function permit(): Handler<Context> {
  return async function(request, context) {
    const authState = await authStateFromHeaders(request.headers, context.bindings.CREDENTIAL_SECRET);
    const authorizer = new PlaygroundResourceAuthorizer(authState);
    context.authz = authorizer;
  }
}

export async function authStateFromHeaders(headers: Headers, secret: string): Promise<AuthorizationState> {
  const header = headers.get('X-Playground-Credential');
  if (!header) {
    throw new AuthorizationError();
  }

  return authStateFromCredential(
    header as Credential.T,
    secret,
  );
}

export async function authStateFromCredential(credential: Credential.T, secret: string): Promise<AuthorizationState> {
  const verificationResult = await Credential.verify({
    crypto,
    textEncoder: new TextEncoder(),
    credential,
    secret,
  });

  if (!verificationResult) {
    throw new AuthorizationError();
  }

  const grant: { [level: string]: true } = {};
  for (const level of verificationResult.grant) {
    grant[level] = true;
  }

  switch (verificationResult.typename) {
    case 'App':
    case 'UserProfile': {
      return {
        [verificationResult.typename]: {
          [verificationResult.id]: grant,
        },
      };
    }
    default: {
      throw new AuthorizationError('Invalid Credential');
    }
  }
}
