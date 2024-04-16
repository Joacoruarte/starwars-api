import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { CommonModule } from 'src/common/common.module';
import { PeopleService } from 'src/people/people.service';
import { SpeciesService } from 'src/species/species.service';
import { PlanetsService } from 'src/planets/planets.service';
import { StarshipsService } from 'src/starships/starships.service';

@Module({
  imports: [CommonModule],
  controllers: [FilmsController],
  providers: [FilmsService, PeopleService, SpeciesService, PlanetsService, StarshipsService],
})
export class FilmsModule {}
