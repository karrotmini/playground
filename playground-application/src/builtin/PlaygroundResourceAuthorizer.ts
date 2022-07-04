import {
  AuthorizationError,
  UnauthorizedError,
  type IResourceAuthorizer,
} from '../runtime/ResourceAuthorizer';
import * as Resource from '../runtime/Resource';

export {
  AuthorizationError,
  UnauthorizedError,
} from '../runtime/ResourceAuthorizer';

export type AuthorizationState = {
  [typename: string]: {
    [id: string]: {
      [level: string]: boolean,
    },
  },
};

export type PermissionScheme = {
  [typename: string]: {
    [level: string]: string[],
  },
};

export class PlaygroundResourceAuthorizer implements IResourceAuthorizer {
  static Scheme: PermissionScheme = {
    UserProfile: {
      owner: ['write', 'read'],
      write: ['read'],
      read: [],
    },
    App: {
      owner: ['write', 'read'],
      write: ['read'],
      read: [],
    },
  };

  #state: AuthorizationState;

  constructor(state: AuthorizationState = {}) {
    this.#state = state;
  }

  toJSON() {
    return structuredClone(this.#state);
  }

  permit(resource: Resource.T, level: string) {
    const { id, typename } = resource;
    const scheme = PlaygroundResourceAuthorizer.Scheme[typename];
    if (!scheme?.[level]) {
      throw new AuthorizationError();
    }
    this.#state[typename] = this.#state[typename] || {};
    this.#state[typename][id] = this.#state[typename][id] || {};
    this.#state[typename][id][level] = true;
    for (const child of scheme[level]) {
      this.permit(resource, child);
    }
  }

  permitByGlobalId(globalId: string, level: string) {
    const resource = Resource.fromGlobalId(globalId);
    this.permit(resource, level);
  }

  prohibit({ typename, id }: Resource.T) {
    const scheme = PlaygroundResourceAuthorizer.Scheme[typename];
    if (!scheme) {
      throw new AuthorizationError();
    }
    this.#state[typename] = this.#state[typename] || {};
    this.#state[typename][id] = {};
  }

  prohibitByGlobalId(globalId: string) {
    const resource = Resource.fromGlobalId(globalId);
    this.prohibit(resource);
  }

  guard(resource: Resource.T, level: string): void {
    const { typename, id } = resource;
    const granted = Boolean(this.#state[typename]?.[id]?.[level]);
    if (!granted) {
      throw new UnauthorizedError(resource, level);
    }
  }
}
