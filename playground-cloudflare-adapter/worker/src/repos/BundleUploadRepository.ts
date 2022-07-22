import {
  BundleUpload,
  BundleUploadID,
  type BundleUploadSnapshot,
} from '@karrotmini/playground-core/src';
import {
  type IBundleUploadRepository,
} from '@karrotmini/playground-application/src';

import {
  AggregatorProtocolClient,
} from '../base/DurableObjectAggregatorProtocol';

export class BundleUploadRepository
  extends AggregatorProtocolClient<BundleUpload>
  implements IBundleUploadRepository
{
  #namespace: DurableObjectNamespace;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    super(config);
    this.#namespace = config.namespace;
  }

  newId(): Promise<BundleUploadID> {
    const id = this.#namespace.newUniqueId();
    return Promise.resolve(BundleUploadID(id.toString()));
  }

  convertId(id: BundleUploadID): DurableObjectId {
    return this.#namespace.idFromString(id);
  }

  spawn(id: BundleUploadID, snapshot?: BundleUploadSnapshot): BundleUpload {
    return new BundleUpload(id, snapshot);
  }
}
