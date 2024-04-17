import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { SpeciesController } from './species.controller';
import { SpeciesService } from './species.service';
import { PeopleModule } from 'src/people/people.module';

// SpeciesService, PlanetsService, FilmsService, StarshipsService
@Module({
  imports: [CommonModule, forwardRef(() => PeopleModule)],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [SpeciesService],
})
export class SpeciesModule {}
