import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { FilmsModule } from './films/films.module';
import { PeopleModule } from './people/people.module';
import { PlanetsModule } from './planets/planets.module';
import { SpeciesModule } from './species/species.module';
import { StarshipsModule } from './starships/starships.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    PeopleModule,
    PlanetsModule,
    StarshipsModule,
    FilmsModule,
    SpeciesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
