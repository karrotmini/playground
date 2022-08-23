import {
  type DomainEvent,
} from '../framework';
import {
  type UserProfileID,
  type CustomHostID,
  type BundleTemplateID,
} from '../entities';

export type AppCreatedFromTemplateEvent = DomainEvent<'App', 'AppCreatedFromTemplate', {
  name: string,
  tenantId: string,
  templateId: BundleTemplateID,
  ownerId: UserProfileID | null,
  customHostId: CustomHostID,
}>;
