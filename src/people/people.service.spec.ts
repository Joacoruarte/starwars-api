import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { FilmsModule } from 'src/films/films.module';
import { PlanetsModule } from 'src/planets/planets.module';
import { SpeciesModule } from 'src/species/species.module';
import { StarshipsModule } from 'src/starships/starships.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from 'src/config/app.config';
import { JoiValidationSchema } from 'src/config/joi.validation';
import { GetPeopleResponse } from './interfaces/people.interface';

describe('PeopleService', () => {
  let service: PeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: JoiValidationSchema,
          load: [EnvConfiguration],
        }),
        CommonModule,
        forwardRef(() => SpeciesModule),
        forwardRef(() => PlanetsModule),
        forwardRef(() => FilmsModule),
        forwardRef(() => StarshipsModule),
      ],
      providers: [PeopleService],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of people', async () => {
    const people = await service.findAll();
    expect(people).toBeInstanceOf(Object);
    if (people.hasOwnProperty('results')) {
      expect((people as GetPeopleResponse).results?.length).toBeGreaterThan(0);
      expect((people as GetPeopleResponse).results?.[0]).toHaveProperty('id');
    }
  });

  it('should return a person', async () => {
    const person = await service.findOne('1');
    expect(person).toBeInstanceOf(Object);
    expect(person).toHaveProperty('id');
    expect(person.name).toBe('Luke Skywalker');
  });

  it('should return an object with the person information and an array of films when given a valid person id', async () => {
    const id = '1';
    const result = await service.findFullDetailOfOne(id);

    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('films');
    expect(result.films?.[0]).toHaveProperty('id');
  });

  it('should return an object with the person information and an array of species when given a valid person id', async () => {
    const id = '1';
    const result = await service.findFullDetailOfOne(id);

    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('species');
    expect(result.species).toBeInstanceOf(Object);
    expect(result.species?.length).toBeGreaterThan(0);
  });

  it('should return an object with the person information and an array of starships when given a valid person id', async () => {
    const id = '1';
    const result = await service.findFullDetailOfOne(id);

    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('starships');
    expect(result.starships[0]).toHaveProperty('id');
  });

  it('should return an object with the person information and a planet when given a valid person id', async () => {
    const id = '1';
    const result = await service.findFullDetailOfOne(id);

    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('homeworld');
    expect(result.homeworld.length).toBeGreaterThan(0);
  });

  it('should return an object with an error property when given an invalid person id', async () => {
    const id = 'invalid';

    try {
      await service.findFullDetailOfOne(id);
      await service.findOne(id);
    } catch (error) {
      expect(error.response.statusCode).toEqual(404);
      return;
    }
  });
});
