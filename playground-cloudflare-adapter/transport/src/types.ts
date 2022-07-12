import type {
  App,
  AppID,
  AppEvent,
  AppSnapshot,
  BundleUpload,
  BundleUploadID,
  BundleUploadEvent,
  BundleUploadSnapshot,
  CustomHost,
  CustomHostID,
  CustomHostEvent,
  CustomHostSnapshot,
  UserProfile,
  UserProfileID,
  UserProfileEvent,
  UserProfileSnapshot,
} from '@karrotmini/playground-core/src';

export type Definition = (
  | $def<{
    action: 'App_newID',
    request: {
    },
    response: {
      id: string,
    },
    return: {
      id: AppID,
    },
  }>
  | $def<{
    action: 'App_aggregate',
    request: {
      id: AppID,
    },
    response: Maybe<{
      id: AppID,
      snapshot: AppSnapshot,
    }>,
    return: {
      app: Maybe<App>,
    },
  }>
  | $def<{
    action: 'App_commit',
    request: {
      id: AppID,
      snapshot: AppSnapshot,
      events: AppEvent[],
    },
    response: {
      published: Maybe<AppEvent[]>,
    },
    return: {
      published: Maybe<AppEvent[]>,
    },
  }>
  | $def<{
    action: 'BundleUpload_newID',
    request: {
    },
    response: {
      id: BundleUploadID,
    },
    return: {
      id: BundleUploadID,
    },
  }>
  | $def<{
    action: 'BundleUpload_aggregate',
    request: {
      id: BundleUploadID,
    },
    response: Maybe<{
      id: BundleUploadID,
      snapshot: BundleUploadSnapshot,
    }>,
    return: {
      upload: BundleUpload,
    },
  }>
  | $def<{
    action: 'BundleUpload_commit',
    request: {
      id: BundleUploadID,
      snapshot: BundleUploadSnapshot,
      events: BundleUploadEvent[],
    },
    response: {
      published: Maybe<BundleUploadEvent[]>,
    },
    return: {
      published: Maybe<BundleUploadEvent[]>,
    },
  }>
  | $def<{
    action: 'CustomHost_newID',
    request: {
    },
    response: {
      id: CustomHostID,
    },
    return: {
      id: CustomHostID,
    },
  }>
  | $def<{
    action: 'CustomHost_aggregate',
    request: {
      id: CustomHostID,
    },
    response: Maybe<{
      id: CustomHostID,
      snapshot: CustomHostSnapshot,
    }>,
    return: {
      customHost: Maybe<CustomHost>,
    },
  }>
  | $def<{
    action: 'CustomHost_commit',
    request: {
      id: CustomHostID,
      snapshot: CustomHostSnapshot,
      events: CustomHostEvent[],
    },
    response: Maybe<{
      published: Maybe<CustomHostEvent[]>,
    }>,
    return: {
      published: Maybe<CustomHostEvent[]>,
    },
  }>
  | $def<{
    action: 'UserProfile_newID',
    request: {
    },
    response: {
      id: string,
    },
    return: {
      id: UserProfileID,
    },
  }>
  | $def<{
    action: 'UserProfile_aggregate',
    request: {
      id: UserProfileID,
    },
    response: Maybe<{
      id: UserProfileID,
      snapshot: UserProfileSnapshot,
    }>,
    return: {
      userProfile: Maybe<UserProfile>,
    },
  }>
  | $def<{
    action: 'UserProfile_commit',
    request: {
      id: UserProfileID,
      snapshot: UserProfileSnapshot,
      events: UserProfileEvent[],
    },
    response: {
      published: Maybe<UserProfileEvent[]>,
    },
    return: {
      published: Maybe<UserProfileEvent[]>,
    }
  }>
);

export type Action = Definition['action'];
export type ActionMap = { [K in Action]: Extract<Definition, { action: K }> };

export type ServiceBinding = {
  fetch: typeof fetch,
};

export type RequestMessage = {
  [K in Action]: {
    action: K,
    payload: ActionMap[K]['request'],
  }
}[Action];

export type ResponseMessage = {
  [K in Action]: 
    | {
      success: true,
      action: K,
      result: ActionMap[K]['response'],
    }
    | {
      success: false,
      action: K,
      message: string,
    }
}[Action];

type Maybe<T> = T | null;

type $def<T extends {
  action: string,
  request: unknown,
  response: unknown,
  return: unknown,
}> = T;
