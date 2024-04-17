import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { PeopleModule } from 'src/people/people.module';

@Module({
  imports: [CommonModule, forwardRef(() => PeopleModule)],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
