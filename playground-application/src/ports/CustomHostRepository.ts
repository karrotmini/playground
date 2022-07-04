import {
  type Aggregator,
} from '@karrotmini/playground-core/src/framework';
import {
  type CustomHost,
} from '@karrotmini/playground-core/src/entities';

export interface ICustomHostRepository extends Aggregator<CustomHost> {
  queryByHostname(hostname: string): Promise<CustomHost | null>;
  writeIndex(customHost: CustomHost): Promise<void>;
}
