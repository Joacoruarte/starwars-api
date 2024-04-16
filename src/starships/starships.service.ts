import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { GetStarshipsResponse, Starship } from './interfaces/starships.interface';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';

@Injectable()
export class StarshipsService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    private readonly httpAxiosService: AxiosAdapter,
  ) {}

  async findAll(page?: string, search?: string) {
    let starshipsResponse: GetStarshipsResponse | { error: string };

    try {
      const url = `starships?page=${page || 1}${search ? `&search=${search}` : ''}`;
      starshipsResponse = await this.httpAxiosService.get<GetStarshipsResponse>(url);
      starshipsResponse.results = starshipsResponse.results.map((starship) => ({
        id: starship.url.match(/(\d+)/)[1],
        ...starship,
      }));
    } catch (error) {
      console.log('Error in StarshipsService.findAll');
      starshipsResponse = { error: 'Something went wrong' };
    }

    return starshipsResponse;
  }

  async findOne(id: string) {
    let starshipResponse: Starship;
    try {
      starshipResponse = await this.httpAxiosService.get<Starship>(`starships/${id}`);
      starshipResponse = { id, ...starshipResponse };
    } catch (error) {
      console.log('Error in StarshipsService.findOne');
      throw new NotFoundException(`Starship with id ${id} not found`);
    }

    return starshipResponse;
  }

  async findFullDetailOfOne(id: string) {
    let starshipResponse: Starship;
    let pilots = [];
    let films = [];
    const regex = /(\d+)/;

    // Get the starship
    try {
      starshipResponse = await this.findOne(id);
      starshipResponse = { id, ...starshipResponse };
    } catch (error) {
      console.log('Error in StarshipsService.findOne');
      throw new NotFoundException(`Starship with id ${id} not found`);
    }

    // Get the pilots
    try {
      const pilotIds = (starshipResponse.pilots as string[]).map((pilot) => pilot.match(regex)?.[1]).filter(Boolean);
      pilots = await Promise.all(
        pilotIds.map(async (id) => {
          try {
            return await this.peopleService.findOne(id);
          } catch (error) {
            console.log(error);
            return { error: 'Something went wrong' };
          }
        }),
      );
    } catch (error) {
      console.log('Error in StarshipsService.findFullDetailOfOne');
      pilots = [];
    }

    // Get films data
    try {
      const filmsIds = (starshipResponse.films as string[]).map((film) => film.match(regex)?.[1]).filter(Boolean);
      films = await Promise.all(
        filmsIds
          .map(async (filmId) => {
            try {
              const filmResponse = await this.filmsService.findOne(filmId);
              return filmResponse;
            } catch (error) {
              return null;
            }
          })
          .filter(Boolean),
      );
    } catch (error) {
      films = [];
    }

    return { ...starshipResponse, pilots, films };
  }
}
