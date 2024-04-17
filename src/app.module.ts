import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { PeopleModule } from './people/people.module';
import { SpeciesModule } from './species/species.module';
import { PlanetsModule } from './planets/planets.module';
import { FilmsModule } from './films/films.module';
import { StarshipsModule } from './starships/starships.module';
import { JoiValidationSchema } from './config/joi.validation';
import { EnvConfiguration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema,
      load: [EnvConfiguration],
    }),
    CommonModule,
    PeopleModule,
    SpeciesModule,
    PlanetsModule,
    FilmsModule,
    StarshipsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
