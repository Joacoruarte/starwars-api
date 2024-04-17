import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
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
    let speciesResponse: Specie[];

    try {
      const speciesResponses = await Promise.all([
        this.httpAxiosService.get<GetSpeciesResponse>('/species?page=1'),
        this.httpAxiosService.get<GetSpeciesResponse>('/species?page=2'),
        this.httpAxiosService.get<GetSpeciesResponse>('/species?page=3'),
        this.httpAxiosService.get<GetSpeciesResponse>('/species?page=4'),
      ]);

      speciesResponse = speciesResponses
        .map((response) => response.results)
        .flat()
        .map((response) => {
          const id = response.url.match(/(\d+)/)[1];
          return { id, ...response };
        });
    } catch (_) {
      return { error: 'Something went wrong' };
    }
    return speciesResponse;
  }

  async findOne(id: string) {
    if (!id) throw new NotFoundException('specie id is required');

    let specieResponse: Specie;

    try {
      specieResponse = await this.httpAxiosService.get<Specie>(`/species/${id}`);
      specieResponse = { id, ...specieResponse };
    } catch (error) {
      throw new NotFoundException(`specie with id ${id} not found`);
    }

    return specieResponse;
  }

  async findPeople(id: string) {
    const specieResponse = await this.findOne(id);
    const characters = await this.getCharacters(specieResponse.people as string[]);
    return { ...specieResponse, people: characters };
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
