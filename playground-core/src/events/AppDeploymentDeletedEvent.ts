import {
  type DomainEvent,
} from '../framework';

export type AppDeploymentDeletedEvent = DomainEvent<'App', 'AppDeploymentDeleted', {
  deploymentName: string,
}>;
