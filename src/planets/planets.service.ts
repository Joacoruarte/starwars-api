import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { GetPlanetsResponse, Planet } from './interfaces/planets.interface';
import { FilmsService } from 'src/films/films.service';
import { PeopleService } from 'src/people/people.service';

@Injectable()
export class PlanetsService {
  constructor(
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    private readonly httpAxiosService: AxiosAdapter,
  ) {}

  async findAll(page?: string, search?: string) {
    let planetsResponse: GetPlanetsResponse | { error: string };

    try {
      const url = `planets?page=${page || 1}${search ? `&search=${search}` : ''}`;
      planetsResponse = await this.httpAxiosService.get<GetPlanetsResponse>(url);
      planetsResponse.results = planetsResponse.results.map((planet) => ({
        id: planet.url.match(/(\d+)/)[1],
        ...planet,
      }));
    } catch (error) {
      console.log('Error in PlanetsService.findAll');
      planetsResponse = { error: 'Something went wrong' };
    }

    return planetsResponse;
  }

  async findOne(id: string) {
    let planetResponse: Planet;

    try {
      planetResponse = await this.httpAxiosService.get<Planet>(`planets/${id}`);
      planetResponse = { id, ...planetResponse };
    } catch (error) {
      console.log('Error in PlanetsService.findOne');
      throw new NotFoundException(`Planet with id ${id} not found`);
    }

    return planetResponse;
  }

  async findFullDetailOfOne(id: string) {
    let planetResponse: Planet;
    let residents = [];
    let films = [];
    const regex = /(\d+)/;

    // Get the planet
    try {
      planetResponse = await this.findOne(id);
      planetResponse = { id, ...planetResponse };
    } catch (error) {
      console.log('Error in PlanetsService.findOne');
      throw new NotFoundException(`Planet with id ${id} not found`);
    }

    // Get the residents
    try {
      const residentIds = (planetResponse.residents as string[])
        .map((resident) => resident.match(regex)?.[1])
        .filter(Boolean);
      residents = await Promise.all(
        residentIds.map(async (id) => {
          try {
            return await this.peopleService.findOne(id);
          } catch (error) {
            console.log(error);
            return { error: 'Something went wrong' };
          }
        }),
      );
    } catch (error) {
      console.log('Error in PlanetsService.findFullDetailOfOne');
      residents = [{ error: 'Something went wrong' }];
    }

    // Get the films
    try {
      const filmIds = (planetResponse.films as string[]).map((film) => film.match(regex)?.[1]).filter(Boolean);
      films = await Promise.all(
        filmIds.map(async (id) => {
          try {
            return await this.filmsService.findOne(id);
          } catch (error) {
            console.log(error);
            return { error: 'Something went wrong' };
          }
        }),
      );
    } catch (error) {
      console.log('Error in PlanetsService.findFullDetailOfOne');
      films = [{ error: 'Something went wrong' }];
    }

    return { ...planetResponse, residents, films };
  }
}
