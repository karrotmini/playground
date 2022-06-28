interface Serializable {
  toString(): string;
}

export type SPO<
  S extends Serializable = Serializable,
  P extends Serializable = Serializable,
  O extends Serializable = Serializable,
> = { s: S, p: P, o: O };

type S<T> = T extends SPO<infer S> ? S : never;
type P<T> = T extends SPO<any, infer P> ? P : never;
type O<T> = T extends SPO<any, any, infer O> ? O : never;

export class HexaKV<K extends SPO, V> {
  static spliter = '::';
  static join = (...keys: string[]) => keys.join(HexaKV.spliter);

  static SPO = <K extends SPO>({ s, p, o }: K) => HexaKV.join('spo', s.toString(), p.toString(), o.toString());
  static SOP = <K extends SPO>({ s, p, o }: K) => HexaKV.join('sop', s.toString(), o.toString(), p.toString());
  static PSO = <K extends SPO>({ s, p, o }: K) => HexaKV.join('pso', p.toString(), s.toString(), o.toString());
  static POS = <K extends SPO>({ s, p, o }: K) => HexaKV.join('pos', p.toString(), o.toString(), s.toString());
  static OSP = <K extends SPO>({ s, p, o }: K) => HexaKV.join('osp', o.toString(), s.toString(), p.toString());
  static OPS = <K extends SPO>({ s, p, o }: K) => HexaKV.join('ops', o.toString(), p.toString(), s.toString());

  #namespace: KVNamespace;

  constructor(config: {
    namespace: KVNamespace;
  }) {
    this.#namespace = config.namespace;
  }

  async put(key: K, value: V) {
    const v = JSON.stringify(value);
    await Promise.all([
      this.#namespace.put(HexaKV.SPO(key), v),
      this.#namespace.put(HexaKV.SOP(key), v),
      this.#namespace.put(HexaKV.PSO(key), v),
      this.#namespace.put(HexaKV.POS(key), v),
      this.#namespace.put(HexaKV.OSP(key), v),
      this.#namespace.put(HexaKV.OPS(key), v),
    ]);
  }

  async listPO(props: {
    predicate: { s: S<K> },
    cursor?: string | null,
    limit?: number,
  }): Promise<{
    values: Array<V>,
    cursor?: string,
    listCompleted: boolean,
  }> {
    const s = props.predicate.s.toString();
    const listResult = await this.#namespace.list({
      prefix: HexaKV.join('spo', s),
      cursor: props.cursor,
      limit: props.limit,
    });
    const values = await Promise.all(
      listResult.keys.map(
        key => this.#namespace.get(key.name, 'json'),
      ),
    ) as V[];
    return {
      values,
      cursor: listResult.cursor,
      listCompleted: listResult.list_complete,
    };
  }
}
