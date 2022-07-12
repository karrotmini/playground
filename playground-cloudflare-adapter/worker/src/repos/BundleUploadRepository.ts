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
import * as Util from '../base/Util';

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
    return Promise.resolve(
      BundleUploadID(Util.generateShortId(13)),
    );
  }

  convertId(id: BundleUploadID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: BundleUploadID, snapshot?: BundleUploadSnapshot): BundleUpload {
    return new BundleUpload(id, snapshot);
  }
}
