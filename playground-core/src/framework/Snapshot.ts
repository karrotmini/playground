import {
  type SerializableObject,
  type MustSerializable,
} from './Serializable';

export type Snapshot<Version extends number, Payload extends SerializableObject> = (
  & MustSerializable<Payload>
  & { __tag: 'Snapshot', __version: Version }
);

export type AnySnapshot = Snapshot<number, SerializableObject>;

type Identity<S extends AnySnapshot> = (
  payload: SnapshotPayload<S>,
) => S;
function identity<S extends AnySnapshot>(
  payload: SnapshotPayload<S>,
): S {
  return payload as unknown as S;
}
export function registerSnapshot<S extends AnySnapshot>(): Identity<S> {
  return identity;
}

export type SnapshotVersion<T extends AnySnapshot> = (
  T extends Snapshot<infer V, SerializableObject>
    ? V
    : never
);

export type SnapshotPayload<T extends AnySnapshot> = (
  T extends Snapshot<number, infer Payload>
    ? Omit<Payload, '__tag' | '__version'>
    : never
);
