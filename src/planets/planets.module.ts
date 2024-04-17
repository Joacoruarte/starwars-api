import { Module, forwardRef } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { CommonModule } from 'src/common/common.module';
import { PeopleModule } from 'src/people/people.module';
import { FilmsModule } from 'src/films/films.module';

@Module({
  imports: [CommonModule, forwardRef(() => PeopleModule), forwardRef(() => FilmsModule)],
  controllers: [PlanetsController],
  providers: [PlanetsService],
  exports: [PlanetsService],
})
export class PlanetsModule {}
