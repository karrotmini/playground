import { makeGlobalID } from '@cometjs/relay-utils';
import { type Resource } from '@karrotmini/playground-core/src/framework';

const goi = makeGlobalID();

export type T = Resource;

export function toGlobalId({ typename, id }: Resource): string {
  return goi.toID({ typename: IdDictionary[typename] || typename, id });
}

export function fromGlobalId(globalId: string): Resource {
  const { typename, id } = goi.fromID(globalId);
  return { typename: IdDictionary[typename] || typename, id };
}

const IdDictionary: Record<string, string> = {
  UserProfile: '0',
  0: 'UserProfile',
  App: '1',
  1: 'App',
};
