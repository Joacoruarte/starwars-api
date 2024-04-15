import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { SpeciesService } from 'src/species/species.service';
import { PlanetsService } from 'src/planets/planets.service';
import { FilmsService } from 'src/films/films.service';
import { StarshipsService } from 'src/starships/starships.service';

@Module({
  imports: [CommonModule],
  controllers: [PeopleController],
  providers: [PeopleService, SpeciesService, PlanetsService, FilmsService, StarshipsService],
})
export class PeopleModule {}
