import {
  App,
  AppID,
  type AppSnapshot,
  Utils,
} from '@karrotmini/playground-core/src';
import {
  type IAppRepository,
} from '@karrotmini/playground-application/src';

import {
  AggregatorProtocolClient,
} from '../base/DurableObjectAggregatorProtocol';

export class AppRepository
  extends AggregatorProtocolClient<App>
  implements IAppRepository
{
  #namespace: DurableObjectNamespace;
  #seq: Generator<string>;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    super(config);
    this.#namespace = config.namespace;
    this.#seq = Utils.shortId(Math.random, 13);
  }

  newId(): Promise<AppID> {
    const id = this.#seq.next().value;
    return Promise.resolve(AppID(id));
  }

  convertId(id: AppID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: AppID, snapshot?: AppSnapshot): App {
    return new App(id, snapshot);
  }
}
