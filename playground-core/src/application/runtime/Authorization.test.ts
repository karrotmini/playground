import { describe, expect } from 'vitest';

import {
  App,
  AppID,
} from '../../entities';
import {
  Authorization,
  AuthorizationError,
  UnauthorizedError,
} from './Authorization';

describe('Authorization', test => {
  test('unknown permission', () => {
    const auth = new Authorization();
    const resource = {
      typename: 'Unknown',
      id: 'TEST',
    };

    expect(
      () => auth.permit(resource, 'read'),
    ).toThrowError(AuthorizationError);
  });

  test('App - permit read access', () => {
    const auth = new Authorization();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'read');

    expect(() => auth.guard(app, 'read')).not.toThrow();
    expect(() => auth.guard(app, 'write')).toThrowError(UnauthorizedError);
    expect(() => auth.guard(app, 'admin')).toThrowError(UnauthorizedError);
  });

  test('App - permit write access', () => {
    const auth = new Authorization();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'write');

    expect(() => auth.guard(app, 'read')).not.toThrow();
    expect(() => auth.guard(app, 'write')).not.toThrow();
    expect(() => auth.guard(app, 'admin')).toThrowError(UnauthorizedError);
  });

  test('App - permit admin access', () => {
    const auth = new Authorization();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'admin');

    expect(() => auth.guard(app, 'read')).not.toThrow();
    expect(() => auth.guard(app, 'write')).not.toThrow();
    expect(() => auth.guard(app, 'admin')).not.toThrow();
  });

  test('App - contextual access control', () => {
    const auth = new Authorization();

    const appId = AppID('TEST');
    const app = new App(appId);

    auth.permit(app, 'read');
    expect(() => auth.guard(app, 'write')).toThrowError(UnauthorizedError);

    auth.permit(app, 'write');
    expect(() => auth.guard(app, 'write')).not.toThrow();

    auth.prohibit(app);
    auth.permit(app, 'read');
    expect(() => auth.guard(app, 'write')).toThrowError(UnauthorizedError);

    auth.reset();
    expect(() => auth.guard(app, 'read')).toThrowError(UnauthorizedError);
  });
});
