import {
  UnauthorizedError,
  type IResourceAuthorizer,
} from '../runtime/ResourceAuthorizer';
import * as Resource from '../runtime/Resource';

export class BypassResourceAuthorizer implements IResourceAuthorizer {
  #denylist = new Set<string>();

  permit(resource: Resource.T, level: string): void {
    // noop
  }

  permitByGlobalId(globalId: string, level: string): void {
    // noop
  }

  prohibit(resource: Resource.T): void {
    // noop
  }

  prohibitByGlobalId(globalId: string): void {
    // noop
  }

  guard(resource: Resource.T, level: string): void {
    const id = Resource.toGlobalId(resource);
    if (this.#denylist.has(id)) {
      throw new UnauthorizedError(resource, level);
    }
  }

  deny(resource: Resource.T) {
    const id = Resource.toGlobalId(resource);
    this.#denylist.add(id);
  }
}
