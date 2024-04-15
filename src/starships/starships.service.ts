import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { GetStarshipsResponse, Starship } from './interfaces/starships.interface';

@Injectable()
export class StarshipsService {
  constructor(private readonly httpAxiosService: AxiosAdapter) {}

  async findAll() {
    let starshipsResponse: GetStarshipsResponse | { error: string };

    try {
      starshipsResponse = await this.httpAxiosService.get<GetStarshipsResponse>('starships');
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
}
