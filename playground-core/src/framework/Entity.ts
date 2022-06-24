import { type AnyGUID } from './GUID';

export type EntityID<T> = T extends Entity<infer ID> ? ID : never;

export abstract class Entity<ID extends AnyGUID> {
  #id: ID;

  get id() {
    return this.#id;
  }

  constructor(id: ID) {
    this.#id = id;
  }
}
