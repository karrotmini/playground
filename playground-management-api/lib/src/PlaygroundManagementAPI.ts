import {
  type IPlaygroundManagementAPI,
} from '@karrotmini/playground-management-api/interface';

// TODO
export class PlaygroundManagementAPI implements IPlaygroundManagementAPI {
  #baseUrl: URL;
  #fetch: typeof fetch;

  constructor(config: {
    baseUrl: URL,
    fetch: typeof fetch;
  }) {
    this.#baseUrl = config.baseUrl;
    this.#fetch = config.fetch;
  }
}
