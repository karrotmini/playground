import {
  type UserProfileID,
} from '../entities';

interface ITextEncoder {
  encode(input?: string): Uint8Array;
}

export type CredentialPayload = (
  | UserProfileCredentialPayload
);

export type UserProfileCredentialPayload = {
  // authorization header 에 첨부
  // e.g. Authorization: UserProfile <credential>
  type: 'UserProfile',
  grant: Array<'*'>,
  key: string,
  id: UserProfileID,
};

// msgpack+base62(payload) + "." + msgpack+HMACSHA256(payload, secret)
export type Credential = string & { __BRAND__: 'Credential' };

export async function importSingingKey(props: {
  textEncoder: ITextEncoder,
  crypto: Crypto,
  secret: string,
}): Promise<CryptoKey> {
  const key = await props.crypto.subtle.importKey(
    'raw',
    props.textEncoder.encode(props.secret),
    {
      name: 'HMAC',
      hash: { name: 'SHA-512' },
    },
    true,
    ['sign', 'verify'],
  );
  return key;
}

export type SigningInfo = {
  via: string,
  for: string,
  at: number,
};

export type SigningResult = {
  value: Credential,
  signed: SigningInfo,
};

export async function sign(props: {
  payload: CredentialPayload,
  textEncoder: ITextEncoder,
  crypto: Crypto,
  secret: string,
}): Promise<SigningResult> {
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
