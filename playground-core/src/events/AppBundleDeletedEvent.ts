import {
  type DomainEvent,
} from '../framework';

type Empty = Record<string, never>;
export type AppBundleDeletedEvent = DomainEvent<'AppBundleUpload', 'AppBundleDeleted', Empty>;
