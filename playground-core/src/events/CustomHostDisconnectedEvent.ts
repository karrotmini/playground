import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
} from '../entities';

export type CustomHostDisconnectedEvent = DomainEvent<'CustomHost', 'CustomHostDisconnected', {
  appId: AppID,
}>;
