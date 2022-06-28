import {
  App,
  AppID,
  type AppSnapshot,
  type IAppRepository,
} from '@karrotmini/playground-core/src';
import {
  AggregatorProtocolClient,
} from './base/DurableObjectAggregatorProtocol';
import * as Utils from './base/utils';

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
      AppID(Utils.generateShortId(13)),
    );
  }

  convertId(id: AppID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: AppID, snapshot?: AppSnapshot): App {
    return new App(id, snapshot);
  }
}
