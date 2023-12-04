import { IsInt, IsString, IsNotEmpty, IsIn, Min, Max } from 'class-validator';

// src/events/event.model.ts
export class EventEditDto {
    
    @IsString()
    @IsNotEmpty()
    Name: string;

    @IsString()
    @IsNotEmpty()
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