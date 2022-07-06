import { type Handler } from 'worktop';
import { reply } from 'worktop/response';

import { type Context } from './context';

export function guard(): Handler<Context> {
  return async function(request, context) {
    const authPattern = /X-Playground-Management-Key (?<key>\w+)/i;
    const authHeader = request.headers.get('Authorization');
    const authorization = authHeader?.match(authPattern)?.groups?.key;
    if (!authorization || authorization !== context.bindings.MANAGEMENT_KEY) {
      return reply(401, 'operation not permitted');
    }
  }
}
