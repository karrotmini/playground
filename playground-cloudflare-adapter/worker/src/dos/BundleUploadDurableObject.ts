import {
  BundleUpload,
  type BundleUploadID,
  type BundleUploadSnapshot,
} from '@karrotmini/playground-core/src';

import {
  AggregatorDurableObject,
} from '../base/DurableObjectAggregatorProtocol';

export class BundleUploadDurableObject
  extends AggregatorDurableObject<BundleUpload>
  implements DurableObject
{
  readonly aggregateName = 'BundleUpload' as const;

  spawn(id: BundleUploadID, snapshot?: BundleUploadSnapshot): BundleUpload {
    return new BundleUpload(id, snapshot);
  }
}
