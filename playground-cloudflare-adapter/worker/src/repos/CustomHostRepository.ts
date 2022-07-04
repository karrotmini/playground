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
    return Promise.resolve(
      CustomHostID(Util.generateShortId(13)),
    );
  }

  convertId(id: CustomHostID): DurableObjectId {
    return this.#namespace.idFromName(id);
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
