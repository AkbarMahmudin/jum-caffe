import { randomUUID } from 'crypto';

export class BaseEvent<T> {
  eventId!: string;
  eventType!: string;
  eventVersion!: string;
  occurredAt?: string = new Date().toISOString();
  producer!: string;
  payload!: T;

  constructor(eventType?: string, payload?: T) {
    this.eventId = randomUUID();
    if (eventType) this.eventType = eventType;
    if (payload) this.payload = payload;
  }

  public toString() {
    return JSON.stringify({
      eventId: this.eventId,
      eventType: this.eventType,
      eventVersion: this.eventVersion,
      occurredAt: this.occurredAt,
      producer: this.producer,
      payload: this.payload,
    });
  }
}
