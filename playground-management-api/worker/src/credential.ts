import * as Base62 from '@urlpack/base62';
import {
  makeMessagePackEncoder,
  makeMessagePackDecoder,
} from '@urlpack/msgpack';
import {
  type AppID,
  type UserProfileID,
} from '@karrotmini/playground-core/src';

// Note: authorization header 에 첨부
// e.g. Authorization: Playground-Management-Api-Credential <credential>
//
// format: msgpack+base62(payload) + "." + msgpack+HMACSHA256+base62(payload, secret)
//
export type T = string & { __BRAND__: 'Credential' };

export class InvalidCredentialError extends Error {
  constructor() {
    super('Invalid credential format');
  }
}

interface ITextEncoder {
  encode(input?: string): Uint8Array;
}

export type Payload = SigningInfo & (
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
  grant: Array<'read' | 'write' | 'owner'>,
};

type AppCredentialPayload = {
  typename: 'App',
  id: AppID,
  grant: Array<'read' | 'write' | 'owner'>,
};

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
  payload: Payload,
  textEncoder: ITextEncoder,
  crypto: Crypto,
  secret: string,
}): Promise<T> {
  const msgpackEncoder = makeMessagePackEncoder();
  const key = await importSingingKey(props);
  const payload = msgpackEncoder.encode(props.payload);
  const signatureData = await props.crypto.subtle.sign('HMAC', key, payload);
  const signature = new Uint8Array(signatureData);
  return `${Base62.encode(payload)}.${Base62.encode(signature)}` as T;
}

export function parse(credential: T): {
  payload: Payload,
  payloadSource: Uint8Array,
  signature: Uint8Array,
} {
  const [payloadPart, signaturePart] = credential.split('.');
  if (!(payloadPart && signaturePart)) {
    throw new InvalidCredentialError();
  }

  const msgpackDecoder = makeMessagePackDecoder();

  const payloadSource = Base62.decode(payloadPart);
  const payload = msgpackDecoder.decode(payloadSource) as Payload;
  if (typeof payload !== 'object') {
    throw new InvalidCredentialError();
  }

  const signature = Base62.decode(signaturePart);

  return {
    payload,
    payloadSource,
    signature,
  };
}

export async function verify(props: {
  credential: T,
  textEncoder: ITextEncoder,
  crypto: Crypto,
  secret: string,
}): Promise<Payload | null> {
  try {
    const { payload, payloadSource, signature } = parse(props.credential);
    const key = await importSingingKey(props);
    const result = await props.crypto.subtle.verify('HMAC', key, signature, payloadSource);
    return result ? payload : null;
  } catch {
    return null;
  }
}
