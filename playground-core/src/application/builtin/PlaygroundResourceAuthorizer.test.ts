import { describe, expect } from 'vitest';

import {
  App,
  AppID,
} from '../../entities';
import {
  PlaygroundResourceAuthorizer,
  AuthorizationError,
  UnauthorizedError,
} from './PlaygroundResourceAuthorizer';

describe('PlaygroundResourceAuthorizer', test => {
  test('unknown resource', () => {
    const auth = new PlaygroundResourceAuthorizer();
    const resource = {
      typename: 'Unknown',
      id: 'TEST',
    };

    expect(
      () => auth.permit(resource, 'read'),
    ).toThrowError(AuthorizationError);
  });

  test('App - permit read access', () => {
    const auth = new PlaygroundResourceAuthorizer();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'read');

    expect(() => auth.guard(app, 'read')).not.toThrow();
    expect(() => auth.guard(app, 'write')).toThrowError(UnauthorizedError);
    expect(() => auth.guard(app, 'admin')).toThrowError(UnauthorizedError);
  });

  test('App - permit write access', () => {
    const auth = new PlaygroundResourceAuthorizer();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'write');

    expect(() => auth.guard(app, 'read')).not.toThrow();
    expect(() => auth.guard(app, 'write')).not.toThrow();
    expect(() => auth.guard(app, 'admin')).toThrowError(UnauthorizedError);
  });

  test('App - permit owner access', () => {
    const auth = new PlaygroundResourceAuthorizer();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'owner');

    expect(() => auth.guard(app, 'read')).not.toThrow();
    expect(() => auth.guard(app, 'write')).not.toThrow();
    expect(() => auth.guard(app, 'owner')).not.toThrow();
  });

  test('App - contextual access control', () => {
    const auth = new PlaygroundResourceAuthorizer();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'read');
    expect(() => auth.guard(app, 'write')).toThrowError(UnauthorizedError);

    auth.permit(app, 'write');
    expect(() => auth.guard(app, 'write')).not.toThrow();

    auth.prohibit(app);
    auth.permit(app, 'read');
    expect(() => auth.guard(app, 'write')).toThrowError(UnauthorizedError);
  });
});
