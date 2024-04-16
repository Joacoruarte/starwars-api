import { Film } from 'src/films/interfaces/films.interface';
import { People } from 'src/people/interfaces/people.interface';

export interface Planet {
  id: string;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[] | People[];
  films: string[] | Film[];
  created: string;
  edited: string;
  url: string;
}

export class GetPlanetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planet[];
}
