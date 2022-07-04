export interface ITracer {
  startSpan(name: string): ISpan;
}

export interface ISpan {
  end(): void;
}
