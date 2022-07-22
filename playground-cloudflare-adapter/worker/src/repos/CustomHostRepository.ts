import {
  CustomHost,
  CustomHostID,
  type CustomHostSnapshot,
} from '@karrotmini/playground-core/src';
import {
  type ICustomHostRepository,
} from '@karrotmini/playground-application/src';

import {
  AggregatorProtocolClient,
} from '../base/DurableObjectAggregatorProtocol';
import * as Util from '../base/Util';

export class CustomHostRepository
  extends AggregatorProtocolClient<CustomHost>
  implements ICustomHostRepository
{
  #namespace: DurableObjectNamespace;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    super(config);
    this.#namespace = config.namespace;
  }

  newId(): Promise<CustomHostID> {
    const id = this.#namespace.newUniqueId();
    return Promise.resolve(CustomHostID(id.toString()));
  }

  convertId(id: CustomHostID): DurableObjectId {
    return this.#namespace.idFromString(id);
  }

  spawn(id: CustomHostID, snapshot?: CustomHostSnapshot): CustomHost {
    return new CustomHost(id, snapshot);
  }

  writeIndex(customHost: CustomHost): Promise<void> {
    throw new Error('not implemented');
  }

  queryByHostname(hostname: string): Promise<CustomHost | null> {
    throw new Error('not implemented');
  }
}
