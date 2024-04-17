import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesService } from './species.service';
import { CommonModule } from 'src/common/common.module';
import { PeopleModule } from 'src/people/people.module';
import { forwardRef } from '@nestjs/common';
import { Specie } from './interfaces/species.interface';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from 'src/config/joi.validation';
import { EnvConfiguration } from 'src/config/app.config';

describe('SpeciesService', () => {
  let service: SpeciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: JoiValidationSchema,
          load: [EnvConfiguration],
        }),
        CommonModule,
        forwardRef(() => PeopleModule),
      ],
      providers: [SpeciesService],
    }).compile();

    service = module.get<SpeciesService>(SpeciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of species', async () => {
    const species = await service.findAll();
    expect(species).toBeInstanceOf(Object);
    expect((species as Specie[]).length).toBeGreaterThan(0);
    expect((species as Specie[])[0]).toHaveProperty('id');
  });

  it('should return a specie', async () => {
    const specie = await service.findOne('1');
    expect(specie).toBeInstanceOf(Object);
    expect(specie).toHaveProperty('id');
    expect(specie.name).toBe('Human');
  });

  it('should return an object with the specie information and an array of characters when given a valid specie id', async () => {
    const id = '1';
    const result = await service.findPeople(id);

    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('people');

    if (Array.isArray(result.people)) {
      if (result.people.length > 0) {
        expect(result.people[0]).toHaveProperty('id');
      }
    } else {
      expect(result.people).toHaveProperty('error');
    }
  });

  it('should return an object with an error property when given an invalid specie id', async () => {
    const id = 'invalid';

    try {
      await service.findPeople(id);
    } catch (error) {
      expect(error.response.statusCode).toEqual(404);
      return;
    }
  });
});
