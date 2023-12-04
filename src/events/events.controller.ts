// src/events/events.controller.ts
import { Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe, BadGatewayException, BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.model';
import { EventCreateDto } from './event-create.dto';
import { EventEditDto } from './event-edit.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    getAllEvents(): Event[] {
        return this.eventsService.getAllEvents();
    }

    @Get(':eventId')
    getEventById(
        @Param() params
    ): Event {
        return this.eventsService.getEventById(params.eventId);
    }

    @Post()
    async createEvent(
        @Body() event: EventCreateDto
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            this.eventsService.createEvent(event)
            .then((eventId) => {
                resolve(eventId);
            }).catch((error) => {
                reject(error);
            });
        })
    }

    @Put(':eventId')
    updateEvent(
        @Param() params,
        @Body() eventModel: EventEditDto
    ): string {
        this.eventsService.updateEvent(params.eventId, eventModel);
        return 'Event updated';
    }

    @Delete(':eventId')
    deleteEvent(
        @Param() params,
    ): string {
        this.eventsService.deleteEvent(params.eventId);
        return 'Event deleted';
    }
}