import { Injectable, BadRequestException } from '@nestjs/common';
import { Event } from './event.model';
import { EventCreateDto } from './event-create.dto';
import { validate } from 'class-validator';
import { EventEditDto } from './event-edit.dto';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class EventsService {
    private events: Event[] = [];

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

    async canSaveAds(ipAddress: string) {
        try {
            const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const ipInfo = response.data;
            return this.getAdPartnerData(ipInfo.countryCode);
        } catch (error) {
            console.error('Error fetching IP information:', error.message);
            return false;
        }
    }

    async getAdPartnerData(countryCode: string) {
        const url = 'https://us-central1-o7tools.cloudfunctions.net/fun7-ad-partner';
        const authConfig = {
            username: 'fun7user',
            password: 'fun7pass',
        };

        try {
            const response = await axios.get(url, {
                params: { countryCode },
                auth: authConfig,
            });

            const adPartnerData = response.data;
            return adPartnerData.ads == 'sure, why not!';
        } catch (error) {
            console.error('Error fetching ad partner data:', error.message);
            return false;
        }
    }

    async createEvent(event: EventCreateDto, userIp: string): Promise<string> {
        let authorized = event.Type == "ads" ? await this.canSaveAds(userIp) : true;
        
        if (authorized) {
            const newEvent: Event = {
                ...event,
                EventId: this.generateUniqueId(),
            }
            this.events.push(newEvent);
    
            return newEvent.EventId;
        }
    }

    async updateEvent(eventId: string, eventModel: EventEditDto, userIp: string): Promise<void> {
        
        let authorized = eventModel.Type == "ads" ? await this.canSaveAds(userIp) : true;

        if (authorized) {
            const index = this.events.findIndex(event => event.EventId == eventId);
            if (index !== -1) {
                this.events[index] = { ...this.events[index], ...eventModel };
            }
        }
    }

    async deleteEvent(eventId: string): Promise<void> {
        const index = this.events.findIndex(event => event.EventId == eventId);
        if (index !== -1) {
            this.events.splice(index, 1);
        }
    }
}
