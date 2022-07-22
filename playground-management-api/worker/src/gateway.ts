import { type Handler } from 'worktop';
import { reply } from 'worktop/response';

import { type WorkerContext } from './context';
import { MiniControl } from './adapters/MiniControl';

export function trust(): Handler<WorkerContext> {
  return async function(request, context) {
    const control = new MiniControl({
      service: context.bindings.minictl,
    });

    const pattern = /X-Playground-Management-Key (?<key>\w+)/i;
    const header = request.headers.get('Authorization');
    const mangementKey = header?.match(pattern)?.groups?.key;

    if (!mangementKey) {
      return reply(401, 'operation not permitted');
    }

    const valid = await control.validateManagementKey(mangementKey);
    if (!valid) {
      return reply(401, 'operation not permitted');
    }
  }
}
