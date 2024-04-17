import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { GetPlanetsResponse, Planet } from './interfaces/planets.interface';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';

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
      const url = `/planets?page=${page || 1}${search ? `&search=${search}` : ''}`;
      planetsResponse = await this.httpAxiosService.get<GetPlanetsResponse>(url);
      planetsResponse.results = planetsResponse.results.map((planet) => ({
        id: this.extractIdFromUrl(planet.url),
        ...planet,
      }));
    } catch (error) {
      console.log('Error in PlanetsService.findAll');
      if ((page || search) && error.detail === 'Not found') {
        return { count: 0, next: null, previous: null, results: [] };
      }
      planetsResponse = { error: 'Something went wrong' };
    }

    return planetsResponse;
  }

  async findOne(id: string) {
    let planetResponse: Planet;

    try {
      planetResponse = await this.httpAxiosService.get<Planet>(`/planets/${id}`);
      planetResponse = { id, ...planetResponse };
    } catch (error) {
      console.log('Error in PlanetsService.findOne');
      throw new NotFoundException(`Planet with id ${id} not found`);
    }

    return planetResponse;
  }

  async findFullDetailOfOne(id: string) {
    const planetResponse = await this.findOne(id);
    const residents = await this.getCharacters(planetResponse.residents as string[]);
    const films = await this.getFilms(planetResponse.films as string[]);

    return { ...planetResponse, residents, films };
  }

  private async getCharacters(characters: string[]) {
    const characterIds = characters.map((character) => this.extractIdFromUrl(character)).filter(Boolean);
    const characterPromises = characterIds.map((characterId) => this.peopleService.findOne(characterId));
    const characterResults = await Promise.all(characterPromises);
    return !!characterResults.length ? characterResults : ['Unknown'];
  }

  private async getFilms(films: string[]) {
    const filmsIds = films.map((film) => this.extractIdFromUrl(film)).filter(Boolean);
    const filmsPromises = filmsIds.map((filmId) => this.filmsService.findOne(filmId));
    const filmsResults = await Promise.all(filmsPromises);
    return filmsResults;
  }

  private extractIdFromUrl(url: string): string {
    const matches = url.match(/(\d+)/);
    return matches ? matches[1] : '';
  }
}
