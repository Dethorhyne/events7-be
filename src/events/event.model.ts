import { IsInt, IsString, IsNotEmpty, IsIn, Min, Max } from 'class-validator';

// src/events/event.model.ts
export class Event {

    @IsString()
    @IsNotEmpty()
    EventId: string;

    @IsString()
    @IsNotEmpty()
    Name: string;

    @IsString()
    Description: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['crosspromo', 'liveops', 'app', 'ads'])
    Type: string;

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @Max(10)
    Priority: number;
}