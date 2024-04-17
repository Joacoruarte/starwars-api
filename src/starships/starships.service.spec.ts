import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsService } from './starships.service';
import { forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { EnvConfiguration } from 'src/config/app.config';
import { JoiValidationSchema } from 'src/config/joi.validation';
import { FilmsModule } from 'src/films/films.module';
import { PeopleModule } from 'src/people/people.module';
import { GetStarshipsResponse } from './interfaces/starships.interface';

describe('StarshipsService', () => {
  let service: StarshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: JoiValidationSchema,
          load: [EnvConfiguration],
        }),
        CommonModule,
        forwardRef(() => FilmsModule),
        forwardRef(() => PeopleModule),
      ],
      providers: [StarshipsService],
    }).compile();

    service = module.get<StarshipsService>(StarshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of starships', async () => {
    const starships = await service.findAll();
    expect(starships).toBeInstanceOf(Object);
    if (starships.hasOwnProperty('results')) {
      expect((starships as GetStarshipsResponse).count).toBeGreaterThan(0);
      expect((starships as GetStarshipsResponse).results?.[0]).toHaveProperty('id');
    }
  });

  it('should return a starship', async () => {
    const starship = await service.findOne('2');
    expect(starship).toBeInstanceOf(Object);
    expect(starship).toHaveProperty('id');
    expect(starship.name).toBe('CR90 corvette');
  });

  it('should return an object with the starship information and an array of films when given a valid starship id', async () => {
    const id = '2';
    const result = await service.findFullDetailOfOne(id);

    expect(result.id).toEqual(id);
    expect(result).toHaveProperty('films');
    expect(result.films[0]).toHaveProperty('id');
  });

  it('should return an object with an error property when given an invalid starship id', async () => {
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
