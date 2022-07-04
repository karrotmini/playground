type LogInfoFn = (message: string, ...args: unknown[]) => void;
type LogErrorFn = (message: string | Error, ...args: unknown[]) => void;
type CaptureExceptionFn = (exception: unknown) => void;

export interface IReporter {
  debug: LogInfoFn;
  info: LogInfoFn;
  warn: LogInfoFn;
  error: LogErrorFn;
  captureException: CaptureExceptionFn;
}
