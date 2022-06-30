import {
  CustomHost,
  type CustomHostID,
  type CustomHostSnapshot,
} from '@karrotmini/playground-core/src';

import {
  AggregatorDurableObject,
} from '../base/DurableObjectAggregatorProtocol';

export class CustomHostDurableObject
  extends AggregatorDurableObject<CustomHost>
  implements DurableObject
{
  readonly aggregateName = 'CustomHost' as const;

  spawn(id: CustomHostID, snapshot?: CustomHostSnapshot): CustomHost {
    return new CustomHost(id, snapshot);
  }
}
