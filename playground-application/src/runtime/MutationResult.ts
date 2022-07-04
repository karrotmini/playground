import { InvariantError } from '@karrotmini/playground-core/src/errors';
import { type ExecutionResult } from './ExecutionResult';

export type T<ResponseData extends Record<string, unknown>> = (
  | ExecutionResult<ResponseData>
);

export function map<
  ResponseData extends Record<string, unknown>,
  RData,
  RError = null,
>(
  result: T<ResponseData>,
  map: (
    | ((data: ResponseData) => RData)
    | {
      data: ((data: ResponseData) => RData),
      error: ((error: Error) => RError),
    }
  ),
): RData | RError {
  if (typeof map === 'function') {
    if (result.data) {
      return map(result.data);
    }
    if (result.errors) {
      return null as unknown as RError;
    }
  }

  if (map && typeof map === 'object') {
    if (result.data) {
      return map.data(result.data);
    }
    if (result.errors?.[0].originalError) {
      return map.error(result.errors[0].originalError);
    }
  }

  throw new InvariantError('invalid mapExecutionResult params');
}

export function unwrap<
  ResponseData extends Record<string, unknown>,
>(
  result: T<ResponseData>,
): ResponseData | null {
  return map(result, {
    data: result => result,
    error: () => null,
  });
}

export function unwrapError<
  ResponseData extends Record<string, unknown>,
>(
  result: T<ResponseData>,
): Error | null {
  return map(result, {
    data: () => null,
    error: result => result,
  });
}
