export type SerializableValue = null | number | string | boolean | SerializableValue[] | {
  [x: string]: SerializableValue,
};

export type SerializableObject = {
  [x: string]: SerializableValue,
};

export type Serializable<T extends SerializableObject = SerializableObject> = T;
