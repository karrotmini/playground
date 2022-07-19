import {
  type DomainEvent,
} from '../framework';
import {
  type DeploymentRef,
} from '../entities';

export type AppDeploymentCreatedEvent = DomainEvent<'App', 'AppDeploymentCreated', {
  deployment: DeploymentRef,
}>;
