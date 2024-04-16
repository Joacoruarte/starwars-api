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
      filmsResponse = await this.httpAxiosService.get<GetFilmsResponse>('films');
      filmsResponse.results = filmsResponse.results.map((film) => ({
        id: film.url.match(/(\d+)/)[1],
        ...film,
      }));
    } catch (error) {
      console.log('Error in FilmsService.findAll');
      filmsResponse = { error: 'Something went wrong' };
    }

    return filmsResponse;
  }
  async findOne(id: string) {
    let filmResponse: Film;

    try {
      filmResponse = await this.httpAxiosService.get<Film>(`films/${id}`);
      filmResponse = { id, ...filmResponse };
    } catch (error) {
      console.log('Error in FilmsService.findOne');
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return filmResponse;
  }

  async findFullDetailOfOne(id: string) {
    let filmResponse: Film;
    let characters = [];
    const regex = /(\d+)/;

    // Get the film
    try {
      filmResponse = await this.findOne(id);
      filmResponse = { id, ...filmResponse };
    } catch (error) {
      console.log('Error in FilmsService.findOne');
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    // Get the characters
    try {
      const characterIds = (filmResponse.characters as string[]).map((film) => film.match(regex)?.[1]).filter(Boolean);
      const characterPromises = characterIds.map(async (characterId) => {
        try {
          const characterResponse = await this.peopleService.findOne(characterId);
          return { id: characterId, ...characterResponse };
        } catch (_) {
          return null;
        }
      });

      const characterResults = await Promise.all(characterPromises);

      // Filter out null characters
      characters = characterResults.filter((character) => character !== null);
    } catch (error) {
      console.log('Error in FilmsService.findOne');
    }

    return {
      ...filmResponse,
      characters,
    };
  }
}
