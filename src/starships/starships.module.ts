import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { CommonModule } from 'src/common/common.module';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { SpeciesService } from 'src/species/species.service';
import { PlanetsService } from 'src/planets/planets.service';

@Module({
  imports: [CommonModule],
  controllers: [StarshipsController],
  providers: [StarshipsService, PeopleService, FilmsService, SpeciesService, PlanetsService],
})
export class StarshipsModule {}
