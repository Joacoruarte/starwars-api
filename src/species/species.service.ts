import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { GetPeopleResponse, People } from 'src/people/interfaces/people.interface';
import { GetSpeciesResponse, Specie } from './interfaces/species.interface';
import { PeopleService } from 'src/people/people.service';

@Injectable()
export class SpeciesService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    private readonly httpAxiosService: AxiosAdapter,
  ) {}

  async findAll() {
    let speciesResponse: Specie[] | { error: string };

    try {
      const speciesResponses = await Promise.all([
        this.httpAxiosService.get<GetSpeciesResponse>('species?page=1'),
        this.httpAxiosService.get<GetSpeciesResponse>('species?page=2'),
        this.httpAxiosService.get<GetSpeciesResponse>('species?page=3'),
        this.httpAxiosService.get<GetSpeciesResponse>('species?page=4'),
      ]);

      speciesResponse = speciesResponses
        .map((response) => response.results)
        .flat()
        .map((response) => {
          const id = response.url.match(/(\d+)/)[1];
          return { id, ...response };
        });
    } catch (error) {
      console.log('Error in SpeciesService.findAll');
      speciesResponse = { error: 'Something went wrong' };
    }

    return speciesResponse;
  }

  async findOne(id: string) {
    let specieResponse: Specie;
    try {
      specieResponse = await this.httpAxiosService.get<Specie>(`species/${id}`);
      specieResponse = { id, ...specieResponse };
    } catch (error) {
      console.log('Error in SpeciesService.findOne');
      throw new NotFoundException(`specie with id ${id} not found`);
    }

    return specieResponse;
  }

  async findPeople(id: string) {
    let specieResponse: Specie;
    let peopleResponse: Pick<GetPeopleResponse, 'count' | 'results'> | { error: string };

    try {
      specieResponse = await this.findOne(id);
    } catch (error) {
      console.log(error);
      throw error;
    }

    try {
      const responses = await Promise.all(
        specieResponse.people?.map(async (specie) => {
          const id = specie.match(/(\d+)/)[1];
          try {
            const response = await this.peopleService.findOne(id);
            return {
              ...response,
              species: [specieResponse.name],
            };
          } catch (error) {
            return null;
          }
        }),
      );

      const validResponses = responses.filter(Boolean);

      peopleResponse = {
        count: validResponses.length,
        results: validResponses as People[],
      };
    } catch (error) {
      console.log('Error in SpeciesService.findPeople');
      peopleResponse = { error: 'Something went wrong' };
    }

    return peopleResponse;
  }
}
