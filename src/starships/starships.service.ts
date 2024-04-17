import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { FilmsService } from 'src/films/films.service';
import { PeopleService } from 'src/people/people.service';
import { GetStarshipsResponse, Starship } from './interfaces/starships.interface';

@Injectable()
export class StarshipsService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    private readonly filmsService: FilmsService,
    private readonly httpAxiosService: AxiosAdapter,
  ) {}

  async findAll(page?: string, search?: string) {
    let starshipsResponse: GetStarshipsResponse | { error: string };

    try {
      const url = `/starships?page=${page || 1}${search ? `&search=${search}` : ''}`;
      starshipsResponse = await this.httpAxiosService.get<GetStarshipsResponse>(url);
      starshipsResponse.results = starshipsResponse.results.map((starship) => ({
        id: this.extractIdFromUrl(starship.url),
        ...starship,
      }));
    } catch (error) {
      console.log('Error in StarshipsService.findAll');
      if ((page || search) && error.detail === 'Not found') {
        return { count: 0, next: null, previous: null, results: [] };
      }
      starshipsResponse = { error: 'Something went wrong' };
    }

    return starshipsResponse;
  }

  async findOne(id: string) {
    let starshipResponse: Starship;
    try {
      starshipResponse = await this.httpAxiosService.get<Starship>(`/starships/${id}`);
      starshipResponse = { id, ...starshipResponse };
    } catch (error) {
      console.log('Error in StarshipsService.findOne');
      throw new NotFoundException(`Starship with id ${id} not found`);
    }

    return starshipResponse;
  }

  async findFullDetailOfOne(id: string) {
    const starshipResponse = await this.findOne(id);
    const pilots = await this.getCharacters(starshipResponse.pilots as string[]);
    const films = await this.getFilms(starshipResponse.films as string[]);
    return { ...starshipResponse, pilots, films };
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
