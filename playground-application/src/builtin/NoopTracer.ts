import {
  type ITracer,
  type ISpan,
} from '../runtime';

export class NoopTracer implements ITracer {
  startSpan(_name: string) {
    return new NoopSpan();
  }
}

class NoopSpan implements ISpan {
  end() {
    // noop
  }
}
