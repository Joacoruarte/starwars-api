import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { GetPlanetsResponse, Planet } from './interfaces/planets.interface';

@Injectable()
export class PlanetsService {
  constructor(private readonly httpAxiosService: AxiosAdapter) {}

  async findAll() {
    let planetsResponse: GetPlanetsResponse | { error: string };

    try {
      planetsResponse = await this.httpAxiosService.get<GetPlanetsResponse>('planets');
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
}
