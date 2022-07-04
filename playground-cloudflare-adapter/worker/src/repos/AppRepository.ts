import {
  App,
  AppID,
  type AppSnapshot,
} from '@karrotmini/playground-core/src';
import {
  type IAppRepository,
} from '@karrotmini/playground-application/src';

import {
  AggregatorProtocolClient,
} from '../base/DurableObjectAggregatorProtocol';
import * as Util from '../base/Util';

export class AppRepository
  extends AggregatorProtocolClient<App>
  implements IAppRepository
{
  #namespace: DurableObjectNamespace;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    super(config);
    this.#namespace = config.namespace;
  }

  newId(): Promise<AppID> {
    return Promise.resolve(
      AppID(Util.generateShortId(13)),
    );
  }

  convertId(id: AppID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: AppID, snapshot?: AppSnapshot): App {
    return new App(id, snapshot);
  }
}
