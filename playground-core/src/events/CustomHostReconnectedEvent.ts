import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
  type CustomHostID,
} from '../entities';

export type CustomHostConnectedEvent = DomainEvent<'CustomHost', 'CustomHostConnected', {
  appId: AppID,
  customHostId: CustomHostID,
}>;
