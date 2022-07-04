import * as Resource from './Resource';

export class AuthorizationError extends TypeError {
}

export class UnauthorizedError extends Error {
  constructor(resource: Resource.T, level: string) {
    super(`${resource.typename}(${resource.id}):${level} 권한이 없습니다.`);
  }
}

/**
 * 기본적인 Resource-based access control을 담당합니다.
 */
export interface IResourceAuthorizer {
  permit(resource: Resource.T, level: string): void;
  permitByGlobalId(globalId: string, level: string): void;
  prohibit(resource: Resource.T): void;
  prohibitByGlobalId(globalId: string): void;
  guard(resource: Resource.T, level: string): void;
}
