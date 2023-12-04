// src/events/events.controller.ts
import { Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe, BadGatewayException, BadRequestException, Req } from '@nestjs/common';
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
        @Body() event: EventCreateDto,
        @Req() requestToReadIp: Request
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const ips = requestToReadIp.headers['x-forwarded-for'] as string;
            const userIp = ips != undefined ? ips.split(",")[0] : "86.32.64.226"; //own IP for testing

            this.eventsService.createEvent(event, userIp)
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
        @Body() eventModel: EventEditDto,
        @Req() requestToReadIp: Request
    ): string {

        const ips = requestToReadIp.headers['x-forwarded-for'] as string
        const userIp = ips != undefined ? ips.split(",")[0] : "86.32.64.226"; //own IP for testing

        this.eventsService.updateEvent(params.eventId, eventModel, userIp);
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