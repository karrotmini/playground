interface Serializable {
  toString(): string;
}

type SPO<
  S extends Serializable,
  P extends Serializable,
  O extends Serializable,
> = { s: S, p: P, o: O };

export class HexaKV {
}
