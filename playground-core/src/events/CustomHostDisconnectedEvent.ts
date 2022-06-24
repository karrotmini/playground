import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
  type CustomHostID,
} from '../entities';

export type CustomHostDisconnectedEvent = DomainEvent<'CustomHost', 'CustomHostDisconnected', {
  appId: AppID,
  customHostId: CustomHostID,
}>;
