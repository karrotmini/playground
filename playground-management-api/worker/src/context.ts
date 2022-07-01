import {
  type Context as WorktopContext,
} from 'worktop';
import {
  type IResourceAuthorizer,
} from '@karrotmini/playground-core/src';

export interface Context extends WorktopContext {
  bindings: WranglerEnv,
  authz: IResourceAuthorizer,
};
