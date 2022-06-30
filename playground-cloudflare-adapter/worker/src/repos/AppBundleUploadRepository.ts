import {
  AppBundleUpload,
  AppBundleUploadID,
  type AppBundleUploadSnapshot,
  type IAppBundleUploadRepository,
} from '@karrotmini/playground-core/src';
import {
  AggregatorProtocolClient,
} from '../base/DurableObjectAggregatorProtocol';
import * as Util from '../base/Util';

export class AppBundleUploadRepository
  extends AggregatorProtocolClient<AppBundleUpload>
  implements IAppBundleUploadRepository
{
  #namespace: DurableObjectNamespace;

  constructor(config: {
    namespace: DurableObjectNamespace,
  }) {
    super(config);
    this.#namespace = config.namespace;
  }

  newId(): Promise<AppBundleUploadID> {
    return Promise.resolve(
      AppBundleUploadID(Util.generateShortId(13)),
    );
  }

  convertId(id: AppBundleUploadID): DurableObjectId {
    return this.#namespace.idFromName(id);
  }

  spawn(id: AppBundleUploadID, snapshot?: AppBundleUploadSnapshot): AppBundleUpload {
    return new AppBundleUpload(id, snapshot);
  }
}
