export type Serializable = (
  | null
  | number
  | string
  | boolean
  | Serializable[]
  | SerializableObject
);

export type SerializableObject = {
  [x: string]: Serializable,
};

export type MustSerializable<T extends Serializable = Serializable> = T;
