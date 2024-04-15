import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { GetPeopleResponse, People } from './interfaces/people.interface';
import { SpeciesService } from 'src/species/species.service';
import { PlanetsService } from 'src/planets/planets.service';
import { FilmsService } from 'src/films/films.service';
import { StarshipsService } from 'src/starships/starships.service';

@Injectable()
export class PeopleService {
  constructor(
    private readonly starshipsService: StarshipsService,
    private readonly filmsService: FilmsService,
    private readonly planetsService: PlanetsService,
    @Inject(forwardRef(() => SpeciesService))
    private readonly speciesService: SpeciesService,
    private readonly httpAxiosService: AxiosAdapter,
  ) {}

  async findAll(page?: string, search?: string) {
    let peopleResponse: GetPeopleResponse | { error: string };
    const regex = /(\d+)/;
    try {
      const url = `people?page=${page || 1}${search ? `&search=${search}` : ''}`;
      peopleResponse = await this.httpAxiosService.get<GetPeopleResponse>(url);
      peopleResponse.results = await Promise.all(
        peopleResponse.results.map(async (person) => {
          const id = person.url?.match(regex)[1] || null;
          const specieId = person.species?.[0]?.match(regex)[1] || null;
          let species = ['Human'];

          if (specieId) {
            try {
              const specieResponse = await this.speciesService.findOne(specieId);
              species = [specieResponse.name];
            } catch (error) {
              console.log(error);
              species = ['Unknown'];
            }
          }

          return {
            id,
            ...person,
            species,
          };
        }),
      );
    } catch (error) {
      console.log('Error in PeopleService.findAll');
      peopleResponse = { error: 'Something went wrong' };
    }

    return peopleResponse;
  }

  async findOne(id: string) {
    const regex = /(\d+)/;
    let peopleResponse: People;
    let species = ['Human'];
    let planet = 'Unknown';
    let films = [];
    let starships = [];

    // Get person data
    try {
      peopleResponse = await this.httpAxiosService.get<People>(`people/${id}`);
      peopleResponse = { id, ...peopleResponse };
    } catch (error) {
      console.log('Error in PeopleService.findOne');
      throw new NotFoundException(`Person with id ${id} not found`);
    }

    // Get planet data
    try {
      const planetId = peopleResponse.homeworld.match(regex)[1];
      if (planetId) {
        const planetResponse = await this.planetsService.findOne(planetId);
        planet = planetResponse.name;
      }
    } catch (_) {
      planet = 'Unknown';
    }

    // Get films data
    try {
      const filmsIds = (peopleResponse.films as string[]).map((film) => film.match(regex)?.[1]).filter(Boolean);
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

    // Get species data
    try {
      const specieId = peopleResponse.species?.[0]?.match(regex)[1] || null;
      if (specieId) {
        const specieResponse = await this.speciesService.findOne(specieId);
        species = [specieResponse.name];
      }
    } catch (_) {
      species = ['Unknown'];
    }

    // Get starships data
    try {
      const starshipsIds = (peopleResponse.starships as string[])
        .map((starship) => starship.match(regex)?.[1])
        .filter(Boolean);

      starships = await Promise.all(
        starshipsIds
          .map(async (starshipId) => {
            try {
              const starshipResponse = await this.starshipsService.findOne(starshipId);
              return starshipResponse;
            } catch (error) {
              return null;
            }
          })
          .filter(Boolean),
      );
    } catch (error) {
      starships = [];
    }

    return {
      ...peopleResponse,
      homeworld: planet,
      films,
      species,
      starships,
    };
  }
}
