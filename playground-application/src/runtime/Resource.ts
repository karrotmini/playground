import { makeGlobalID } from '@cometjs/relay-utils';

const goi = makeGlobalID();

export type T = {
  typename: string,
  id: string,
};

export function toGlobalId({ typename, id }: T): string {
  return goi.toID({ typename: IdDictionary[typename] || typename, id });
}

export function fromGlobalId(globalId: string): T {
  const { typename, id } = goi.fromID(globalId);
  return { typename: IdDictionary[typename] || typename, id };
}

const IdDictionary: Record<string, string> = {
  UserProfile: '0',
  0: 'UserProfile',

  App: '1',
  1: 'App',

  BundleUpload: '2',
  2: 'BundleUpload',

  BundleTemplate: '3',
  3: 'BundleTemplate',

  CustomHost: '4',
  4: 'CustomHost',
};
