import {
  type DomainEvent,
} from '../framework';
import {
  type AppBundleID,
} from '../entities';

export type AppVersionUpdatedEvent = DomainEvent<'App', 'AppVersionUpdated', {
  from: {
    version: number,
    bundleId: AppBundleID,
    isTemplate: boolean,
  },
  to: {
    version: number,
    bundleId: AppBundleID,
    isTemplate: boolean,
  },
}>;
