import {
  type Aggregator,
} from '../../framework';
import {
  type CustomHost,
} from '../../entities';

export interface ICustomHostRepository extends Aggregator<CustomHost> {
  queryByHostname(hostname: string): Promise<CustomHost | null>;
  writeIndex(customHost: CustomHost): Promise<void>;
}
