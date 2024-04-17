import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonModule } from 'src/common/common.module';
import { EnvConfiguration } from 'src/config/app.config';
import { JoiValidationSchema } from 'src/config/joi.validation';
import { FilmsModule } from 'src/films/films.module';
import { PeopleModule } from 'src/people/people.module';
import { SpeciesModule } from 'src/species/species.module';
import { StarshipsModule } from 'src/starships/starships.module';
import { PlanetsService } from './planets.service';
import { forwardRef } from '@nestjs/common';
import { GetPlanetsResponse } from './interfaces/planets.interface';

describe('PlanetsService', () => {
  let service: PlanetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: JoiValidationSchema,
          load: [EnvConfiguration],
        }),
        CommonModule,
        forwardRef(() => PeopleModule),
        forwardRef(() => FilmsModule),
        SpeciesModule,
        StarshipsModule,
      ],
      providers: [PlanetsService],
      exports: [PlanetsService],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of planets', async () => {
    const planets = await service.findAll();
    expect(planets).toBeInstanceOf(Object);
    if (planets.hasOwnProperty('results')) {
      expect((planets as GetPlanetsResponse).count).toBeGreaterThan(0);
      expect((planets as GetPlanetsResponse).results?.[0]).toHaveProperty('id');
    }
  });

  it('should return a planet', async () => {
    const planet = await service.findOne('1');
    expect(planet).toBeInstanceOf(Object);
    expect(planet).toHaveProperty('id');
    expect(planet.name).toBe('Tatooine');
  });

  it('should return an object with the planet information and an array of films when given a valid planet id', async () => {
    const id = '1';
    const result = await service.findFullDetailOfOne(id);
    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('films');
    expect(result.films[0]).toHaveProperty('id');
  });

  it('should return an object with the planet information and an array of characters when given a valid planet id', async () => {
    const id = '1';
    const result = await service.findFullDetailOfOne(id);
    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('residents');
    expect(result.residents[0]).toHaveProperty('id');
  });

  it('should return an object with an error property when given an invalid planet id in find one endpoint', async () => {
    const id = 'invalid';

    try {
      await service.findOne(id);
    } catch (error) {
      expect(error.response.statusCode).toEqual(404);
      return;
    }
  });

  it('should return an object with an error property when given an invalid planet id in detail endpoint', async () => {
    const id = 'invalid';

    try {
      await service.findFullDetailOfOne(id);
    } catch (error) {
      expect(error.response.statusCode).toEqual(404);
      return;
    }
  });
});
