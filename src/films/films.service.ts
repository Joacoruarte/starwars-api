import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Film, GetFilmsResponse } from './interfaces/films.interface';

@Injectable()
export class FilmsService {
  constructor(private readonly httpAxiosService: AxiosAdapter) {}

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
}
