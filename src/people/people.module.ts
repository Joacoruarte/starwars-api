import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { SpeciesModule } from 'src/species/species.module';
import { PlanetsModule } from 'src/planets/planets.module';
import { FilmsModule } from 'src/films/films.module';
import { StarshipsModule } from 'src/starships/starships.module';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => SpeciesModule),
    forwardRef(() => PlanetsModule),
    forwardRef(() => FilmsModule),
    forwardRef(() => StarshipsModule),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
