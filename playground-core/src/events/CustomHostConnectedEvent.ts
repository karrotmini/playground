import {
  type DomainEvent,
} from '../framework';
import {
  type AppID,
} from '../entities';

export type CustomHostConnectedEvent = DomainEvent<'CustomHost', 'CustomHostConnected', {
  appId: AppID,
  deploymentName: string,
}>;
