import {
  App,
  type AppID,
  type AppSnapshot,
} from '@karrotmini/playground-core/src';

import {
  AggregatorDurableObject,
} from '../base/DurableObjectAggregatorProtocol';

export class AppRepositoryDurableObject
  extends AggregatorDurableObject<App>
  implements DurableObject
{
  readonly aggregateName = 'App' as const;

  spawn(id: AppID, snapshot?: AppSnapshot): App {
    return new App(id, snapshot);
  }
}
