import { Film } from 'src/films/interfaces/films.interface';
import { Starship } from 'src/starships/interfaces/starships.interface';

export interface People {
  id: string;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[] | Film[];
  species: string[];
  vehicles: string[];
  starships: string[] | Starship[];
  created: string;
  edited: string;
  url: string;
}

export class GetPeopleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: People[];
}
