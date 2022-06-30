import {
  AppBundleUpload,
  type AppBundleUploadID,
  type AppBundleUploadSnapshot,
} from '@karrotmini/playground-core/src';

import {
  AggregatorDurableObject,
} from '../base/DurableObjectAggregatorProtocol';

export class AppBundleUploadDurableObject
  extends AggregatorDurableObject<AppBundleUpload>
  implements DurableObject
{
  readonly aggregateName = 'AppBundleUpload' as const;

  spawn(id: AppBundleUploadID, snapshot?: AppBundleUploadSnapshot): AppBundleUpload {
    return new AppBundleUpload(id, snapshot);
  }
}
