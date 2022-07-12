import {
  type DomainEvent,
} from '../framework';

type Empty = Record<string, never>;
export type BundleDeletedEvent = DomainEvent<'BundleUpload', 'BundleDeleted', Empty>;
