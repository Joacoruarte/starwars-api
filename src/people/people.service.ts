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
    @Inject(forwardRef(() => StarshipsService))
    private readonly starshipsService: StarshipsService,
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    @Inject(forwardRef(() => PlanetsService))
    private readonly planetsService: PlanetsService,
    @Inject(forwardRef(() => SpeciesService))
    private readonly speciesService: SpeciesService,
    private readonly httpAxiosService: AxiosAdapter,
  ) {}

  async findAll(page?: string, search?: string) {
    let peopleResponse: GetPeopleResponse | { error: string };
    const regex = /(\d+)/;
    try {
      const url = `/people?page=${page || 1}${search ? `&search=${search}` : ''}`;
      peopleResponse = await this.httpAxiosService.get<GetPeopleResponse>(url);
      const promises = peopleResponse.results.map(async (person) => {
        const id = person.url?.match(regex)[1] || null;
        const specieId = person.species?.[0]?.match(regex)[1] || null;
        const specie = await this.getSpecie(specieId);
        return { ...person, id, species: specie };
      });
      peopleResponse.results = await Promise.all(promises);
    } catch (error) {
      console.log(error);

      console.log('Error in PeopleService.findAll');
      if ((page || search) && error.detail === 'Not found') {
        return { count: 0, next: null, previous: null, results: [] };
      }

      peopleResponse = { error: 'Something went wrong' };
    }

    return peopleResponse;
  }

  async findOne(id: string) {
    let peopleResponse: People;
    try {
      peopleResponse = await this.httpAxiosService.get<People>(`/people/${id}`);
      peopleResponse = { id, ...peopleResponse };
    } catch (error) {
      console.log('Error in PeopleService.findOne');
      throw new NotFoundException(`Person with id ${id} not found`);
    }

    return peopleResponse;
  }

  async findFullDetailOfOne(id: string) {
    const peopleResponse = await this.findOne(id);
    const planet = await this.getPlanet(peopleResponse.homeworld);
    const films = await this.getFilms(peopleResponse.films as string[]);
    const species = await this.getSpecies(peopleResponse.species);
    const starships = await this.getStarships(peopleResponse.starships as string[]);

    return {
      ...peopleResponse,
      species,
      homeworld: planet,
      films,
      starships,
    };
  }

  private async getSpecies(species: string[]) {
    const regex = /(\d+)/;
    const speciesIds = species.map((specie) => specie.match(regex)?.[1]).filter(Boolean);
    const speciesPromises = speciesIds.map((specieId) => this.speciesService.findOne(specieId));
    const speciesResults = await Promise.all(speciesPromises);
    return !!speciesResults.length ? [speciesResults?.[0].name] : ['Unknown'];
  }

  private async getSpecie(specieId: string) {
    try {
      const response = await this.speciesService.findOne(specieId);
      return [response.name];
    } catch (error) {
      return error.response.statusCode === 404 && ['Unknown'];
    }
  }

  private async getFilms(films: string[]) {
    const filmsIds = films.map((film) => this.extractIdFromUrl(film)).filter(Boolean);
    const filmsPromises = filmsIds.map((filmId) => this.filmsService.findOne(filmId));
    const filmsResults = await Promise.all(filmsPromises);
    return filmsResults;
  }

  private async getPlanet(planetUrl: string) {
    const planetId = this.extractIdFromUrl(planetUrl);
    const planetResponse = await this.planetsService.findOne(planetId);
    return planetResponse.name;
  }

  private async getStarships(starships: string[]) {
    const starshipsIds = starships.map((starship) => this.extractIdFromUrl(starship)).filter(Boolean);
    const starshipsPromises = starshipsIds.map((starshipId) => this.starshipsService.findOne(starshipId));
    const starshipsResults = await Promise.all(starshipsPromises);
    return starshipsResults;
  }

  private extractIdFromUrl(url: string): string {
    const matches = url.match(/(\d+)/);
    return matches ? matches[1] : '';
  }
}
