import {
  type IReporter,
} from '../runtime';

// eslint-disable-next-line
const noop = () => {};

export class NoopReporter implements IReporter {
  debug = noop;
  info = noop;
  warn = noop;
  error = noop;
  captureException = noop;
}
