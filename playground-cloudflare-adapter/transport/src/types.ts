import type {
  App,
  AppID,
  AppEvent,
  AppSnapshot,
  UserProfile,
  UserProfileID,
  UserProfileEvent,
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
    Action: 'App_newID',
    Request: {
    },
    Response: {
      id: string,
    },
    Return: {
      id: AppID,
    },
  }
  | {
    Action: 'App_aggregate',
    Request: {
      id: AppID,
    },
    Response: Maybe<{
      id: AppID,
      snapshot: AppSnapshot,
    }>,
    Return: {
      app: Maybe<App>,
    },
  }
  | {
    Action: 'App_commit',
    Request: {
      id: AppID,
      snapshot: AppSnapshot,
      events: AppEvent[],
    },
    Response: {
      published: Maybe<AppEvent[]>,
    },
    Return: {
    },
  }
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
