import {
  App,
  AppID,
  type AppSnapshot,
  type IAppRepository,
} from '@karrotmini/playground-core/src';

export class AppRepository
  implements IAppRepository
{
  #fetch: typeof fetch;

  constructor(config: {
    fetch: typeof fetch,
  }) {
    this.#fetch = config.fetch;
  }

  newId(): Promise<AppID> {
    throw new Error('not implemented');
  }
}
