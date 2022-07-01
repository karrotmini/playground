import {
  type AppID,
  type UserProfileID,
} from '@karrotmini/playground-core/src';

interface ITextEncoder {
  encode(input?: string): Uint8Array;
}

export type CredentialPayload = SigningInfo & (
  | AppCredentialPayload
  | UserProfileCredentialPayload
);

export type SigningInfo = {
  via: string,
  for: string,
  at: number,
};

type UserProfileCredentialPayload = {
  typename: 'UserProfile',
  id: UserProfileID,
  grant: Array<'*'>,
};

type AppCredentialPayload = {
  typename: 'App',
  id: AppID,
  grant: Array<'*'>,
};

// Note: authorization header 에 첨부
// e.g. Authorization: Playground-Management-Api-Credential <credential>
//
// format: msgpack+base62(payload) + "." + msgpack+HMACSHA256(payload, secret)
export type Credential = string & { __BRAND__: 'Credential' };

async function importSingingKey(props: {
  textEncoder: ITextEncoder,
  crypto: Crypto,
  secret: string,
}): Promise<CryptoKey> {
  const key = await props.crypto.subtle.importKey(
    'raw',
    props.textEncoder.encode(props.secret),
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify'],
  );
  return key;
}

export async function sign(props: {
  payload: CredentialPayload,
  textEncoder: ITextEncoder,
  crypto: Crypto,
  secret: string,
}): Promise<Credential> {
  throw new Error('Not implemented');
}

export async function verify(props: {
  credential: Credential,
  textEncoder: ITextEncoder,
  crypto: Crypto,
  secret: string,
}): Promise<CredentialPayload | null> {
  throw new Error('Not implemented');
}
