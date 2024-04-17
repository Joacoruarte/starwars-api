import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { EnvConfiguration } from 'src/config/app.config';
import { JoiValidationSchema } from 'src/config/joi.validation';
import { PeopleModule } from 'src/people/people.module';
import { GetFilmsResponse } from './interfaces/films.interface';

describe('FilmsService', () => {
  let service: FilmsService;

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
      providers: [FilmsService],
      exports: [FilmsService],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of films', async () => {
    const films = await service.findAll();
    expect(films).toBeInstanceOf(Object);
    if (films.hasOwnProperty('results')) {
      expect((films as GetFilmsResponse).count).toBeGreaterThan(0);
      expect((films as GetFilmsResponse).results?.[0]).toHaveProperty('id');
    }
  });

  it('should return a film', async () => {
    const film = await service.findOne('1');
    expect(film).toBeInstanceOf(Object);
    expect(film).toHaveProperty('id');
    expect(film.title).toBe('A New Hope');
  });

  it('should return an object with the film information and an array of characters when given a valid film id', async () => {
    const id = '1';
    const result = await service.findFullDetailOfOne(id);

    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('characters');
    expect(result.characters[0]).toHaveProperty('id');
  });

  it('should return an object with an error property when given an invalid film id', async () => {
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
