export type GUID<TypeName extends string> = (
  & string
  & { __typename: TypeName }
);

export type AnyGUID<TypeName extends string = string> = GUID<TypeName>;

type Identity<ID extends AnyGUID> = (value: string) => ID;
function identity<B extends AnyGUID>(value: string): B {
  return value as B;
}
export function registerGUID<ID extends AnyGUID>(): Identity<ID> {
  return identity;
}
