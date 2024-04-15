import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { SpeciesController } from './species.controller';
import { SpeciesService } from './species.service';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { PlanetsService } from 'src/planets/planets.service';
import { StarshipsService } from 'src/starships/starships.service';

@Module({
  imports: [CommonModule],
  controllers: [SpeciesController],
  providers: [SpeciesService, PeopleService, FilmsService, PlanetsService, StarshipsService],
})
export class SpeciesModule {}
