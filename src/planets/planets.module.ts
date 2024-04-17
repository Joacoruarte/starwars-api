import { Module, forwardRef } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { CommonModule } from 'src/common/common.module';
import { PeopleModule } from 'src/people/people.module';
import { FilmsModule } from 'src/films/films.module';
// import { PeopleService } from 'src/people/people.service';
// import { FilmsService } from 'src/films/films.service';
// import { StarshipsService } from 'src/starships/starships.service';
// import { SpeciesService } from 'src/species/species.service';
// PeopleService, FilmsService, StarshipsService, SpeciesService
@Module({
  imports: [CommonModule, forwardRef(() => PeopleModule), FilmsModule],
  controllers: [PlanetsController],
  providers: [PlanetsService],
  exports: [PlanetsService],
})
export class PlanetsModule {}
