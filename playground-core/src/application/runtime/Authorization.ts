import * as Resource from './Resource';

type PermissionScheme = {
  [typename: string]: {
    [level: string]: string[],
  },
};

type PermissionState = {
  [typename: string]: {
    [id: string]: {
      [level: string]: boolean,
    },
  },
};

export class AuthorizationError extends TypeError {
}

export class UnauthorizedError extends Error {
  constructor(resource: Resource.T, level: string) {
    super(`${resource.typename}(${resource.id}):${level} 권한이 없습니다.`);
  }
}

export class Authorization {
  static #scheme: PermissionScheme = {
    UserProfile: {
      write: ['read'],
      read: [],
    },
    App: {
      owner: ['write'],
      admin: ['write'],
      write: ['read'],
      read: [],
    },
  };

  #state: PermissionState;

  constructor(state: PermissionState = {}) {
    this.#state = state;
  }

  toJSON() {
    return structuredClone(this.#state);
  }

  permit(resource: Resource.T, level: string) {
    const { id, typename } = resource;
    const scheme = Authorization.#scheme[typename];
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

  reset() {
    this.#state = {};
  }

  prohibit({ typename, id }: Resource.T) {
    const scheme = Authorization.#scheme[typename];
    if (!scheme) {
      throw new AuthorizationError();
    }
    this.#state[typename] = this.#state[typename] || {};
    this.#state[typename][id] = {};
  }

  guard(resource: Resource.T, level: string): void {
    const { typename, id } = resource;
    const granted = Boolean(this.#state[typename]?.[id]?.[level]);
    if (!granted) {
      throw new UnauthorizedError(resource, level);
    }
  }
}
