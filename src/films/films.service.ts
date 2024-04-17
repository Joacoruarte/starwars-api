import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Film, GetFilmsResponse } from './interfaces/films.interface';
import { PeopleService } from 'src/people/people.service';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    private readonly httpAxiosService: AxiosAdapter,
  ) {}

  async findAll() {
    let filmsResponse: GetFilmsResponse | { error: string };

    try {
      filmsResponse = await this.httpAxiosService.get<GetFilmsResponse>('/films');
      filmsResponse.results = filmsResponse.results.map((film) => ({
        id: this.extractIdFromUrl(film.url),
        ...film,
      }));
    } catch (error) {
      filmsResponse = { error: 'Something went wrong' };
    }

    return filmsResponse;
  }
  async findOne(id: string) {
    if (!id) throw new NotFoundException('Film id is required');
    let filmResponse: Film;

    try {
      filmResponse = await this.httpAxiosService.get<Film>(`/films/${id}`);
      filmResponse = { id, ...filmResponse };
    } catch (error) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return filmResponse;
  }

  async findFullDetailOfOne(id: string) {
    const filmResponse = await this.findOne(id);
    const characters = await this.getCharacters(filmResponse.characters as string[]);

    return {
      ...filmResponse,
      characters,
    };
  }

  private async getCharacters(characters: string[]) {
    const characterIds = characters.map((character) => this.extractIdFromUrl(character)).filter(Boolean);
    const characterPromises = characterIds.map((characterId) => this.peopleService.findOne(characterId));
    const characterResults = await Promise.all(characterPromises);
    return !!characterResults.length ? characterResults : ['Unknown'];
  }

  private extractIdFromUrl(url: string): string {
    if (!url) return '';
    const matches = url.match(/(\d+)/);
    return matches ? matches[1] : '';
  }
}
