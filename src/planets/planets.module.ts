import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { CommonModule } from 'src/common/common.module';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { StarshipsService } from 'src/starships/starships.service';
import { SpeciesService } from 'src/species/species.service';

@Module({
  imports: [CommonModule],
  controllers: [PlanetsController],
  providers: [PlanetsService, PeopleService, FilmsService, StarshipsService, SpeciesService],
})
export class PlanetsModule {}
