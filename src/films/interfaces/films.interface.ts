import { People } from 'src/people/interfaces/people.interface';

export interface Film {
  id: string;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[] | People[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

export class GetFilmsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Film[];
}
