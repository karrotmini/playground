import {
  type DomainEvent,
} from '../framework';

export type CustomHostDeletedEvent = DomainEvent<'CustomHost', 'CustomHostDeleted', {
  customHostId: string,
}>;
