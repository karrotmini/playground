import { type Resource } from '../runtime';

export class ResourceLoadingError extends Error {
  constructor(resource: Resource.T) {
    super(`Failed to load ${resource.typename}(${resource.id})`);
  }
}
