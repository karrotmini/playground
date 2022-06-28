import type {
  UserProfile,
  UserProfileEvent,
  UserProfileID,
  UserProfileSnapshot,
} from '@karrotmini/playground-core/src';

type Maybe<T> = T | null;

export type ServiceBinding = {
  fetch: typeof fetch,
};

export type RequestMessage = {
  [K in Action]: {
    action: K,
    payload: ActionMap[K]['Request'],
  }
}[Action];

export type ResponseMessage = {
  [K in Action]: 
    | {
      success: true,
      action: K,
      result: ActionMap[K]['Response'],
    }
    | {
      success: false,
      action: K,
      message: string,
    }
}[Action];

export type Action = Definition['Action'];
export type ActionMap = { [K in Action]: Extract<Definition, { Action: K }> };

export type Definition = (
  | {
    Action: 'UserProfile_newID',
    Request: {
    },
    Response: {
      id: string,
    },
    Return: {
      id: UserProfileID,
    },
  }
  | {
    Action: 'UserProfile_aggregate',
    Request: {
      id: UserProfileID,
    },
    Response: Maybe<{
      id: UserProfileID,
      snapshot: UserProfileSnapshot,
    }>,
    Return: {
      userProfile: Maybe<UserProfile>,
    },
  }
  | {
    Action: 'UserProfile_commit',
    Request: {
      id: UserProfileID,
      snapshot: UserProfileSnapshot,
      events: UserProfileEvent[],
    },
    Response: {
      published: Maybe<UserProfileEvent[]>,
    },
    Return: {
    }
  }
);
