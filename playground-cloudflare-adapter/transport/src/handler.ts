/// <reference types="@cloudflare/workers-types" />

import type {
  Action,
  ActionMap,
  RequestMessage,
  ResponseMessage,
} from './types';

export * from './types';

export type ServiceStub<Env = unknown> = {
  [K in Action]: (
    message: ActionMap[K]['request'],
    env: Env,
    ctx: ExecutionContext,
  ) => Promise<ActionMap[K]['response']>
};

export function makePlaygroundServiceHandler<Env = unknown>(stub: ServiceStub<Env>): ExportedHandlerFetchHandler<Env> {
  return async function (request, env, ctx) {
    const message = await request.json() as RequestMessage;
    const action = message.action;

    let responseBody: string;
    try {
      const result = await stub[action](
        message.payload as any,
        env,
        ctx,
      );
      const response = {
        success: true,
        action,
        result,
      } as ResponseMessage;
      responseBody = JSON.stringify(response);
    } catch (e: any) {
      const response = {
        success: false,
        action,
        message: e.message || e.toString(),
      } as ResponseMessage;
      responseBody = JSON.stringify(response);
    }

    return new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
