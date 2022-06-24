import { type GUID } from './GUID';
import { type SerializableObject } from './Serializable';

export interface DomainEvent<
  AggregateName extends string,
  EventName extends string,
  EventPayload extends SerializableObject,
> {
  aggregateName: AggregateName;
  aggregateId: GUID<AggregateName>;
  eventName: EventName;
  eventDate: number;
  eventPayload: EventPayload;
}

export type AnyDomainEvent<AggregateName extends string = string> = (
  | DomainEvent<AggregateName, string, SerializableObject>
);
