import {
  type IReporter,
} from '../runtime';

export class ConsoleReporter implements IReporter {
  debug: IReporter['debug'];
  info: IReporter['info'];
  warn: IReporter['warn'];
  error: IReporter['error'];
  captureException: IReporter['captureException'];

  constructor(console: Console) {
    this.debug = console.debug.bind(console);
    this.info = console.info.bind(console);
    this.warn = console.warn.bind(console);
    this.error = console.error.bind(console);
    this.captureException = console.error.bind(console);
  }
}
