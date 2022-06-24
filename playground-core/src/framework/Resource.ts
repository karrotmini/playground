export interface Resource {
  typename: string;
  id: string;
}

export class ResourceLoadFailureError extends Error {
  constructor(resource: Resource) {
    super(`${resource.typename}(${resource.id}): 리소스를 불러올 수 없습니다.`);
  }
}
