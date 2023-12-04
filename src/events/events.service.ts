import { Injectable, BadRequestException } from '@nestjs/common';
import { Event } from './event.model';
import { EventCreateDto } from './event-create.dto';
import { validate } from 'class-validator';
import { EventEditDto } from './event-edit.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
    private events: Event[] = [];
    private readonly allowedEventTypes: string[] = ['crosspromo', 'liveops', 'app', 'ads'];

    getAllEvents(): Event[] {
        return this.events;
    }

    getEventById(eventId: string): Event {
        return this.events.find(event => event.EventId == eventId);
    }

    generateUniqueId(): string {
        // Generate a new UUID (v4)
        const uniqueId = uuidv4();
        return uniqueId;
      }

    async createEvent(event: EventCreateDto): Promise<string> {
        const errors = await validate(event);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        const newEvent: Event = {
            ...event,
            EventId: this.generateUniqueId(),
        }
        this.events.push(newEvent);

        return newEvent.EventId;
    }

    updateEvent(eventId: string, eventModel: EventEditDto): void {
        const index = this.events.findIndex(event => event.EventId == eventId);
        if (index !== -1) {
            this.events[index] = { ...this.events[index], ...eventModel };
        }
        else {
            throw new BadRequestException("Event does not exist");
        }
    }

    deleteEvent(eventId: string): void {
        const index = this.events.findIndex(event => event.EventId == eventId);
        if (index !== -1) {
            this.events.splice(index, 1);
        }
        else {
            throw new BadRequestException("Event does not exist");
        }
    }
}
