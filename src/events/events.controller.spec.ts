import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventCreateDto } from './event-create.dto';
import { BadRequestException } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an event', async () => {
    const createDto: EventCreateDto = {
      Name: 'Test Event',
      Description: 'Testing event creation',
      Type: 'app',
      Priority: 5,
    };
  
    const result = await controller.createEvent(createDto);
  
    expect(result).toEqual(1);
  });

  it('should fail for missing required data', async () => {
    const createDto = {
      Name: '',
      Description: null,
      Type: 'app',
      Priority: 5,
    };

    expect(await controller.createEvent(createDto)).toEqual(BadRequestException);
  
  });

  it('should fail for invalid type', async () => {
    const createDto = {
      Name: 'Test Event',
      Description: 'Testing event creation',
      Type: 'invalid',
      Priority: 5,
    };

    expect(await controller.createEvent(createDto)).toEqual(BadRequestException);
  
  });

  it('should fail for priority', async () => {
    const createDtoUnder = {
      Name: 'Test Event',
      Description: 'Testing event creation',
      Type: 'invalid',
      Priority: -20,
    };

    expect(await controller.createEvent(createDtoUnder)).toEqual(BadRequestException);

    const createDtoOver = {
      Name: 'Test Event',
      Description: 'Testing event creation',
      Type: 'invalid',
      Priority: 20,
    };

    expect(await controller.createEvent(createDtoOver)).toEqual(BadRequestException);
  
  });

  // Add more test cases for other controller methods

  afterEach(() => {
    jest.resetAllMocks();
  });
});