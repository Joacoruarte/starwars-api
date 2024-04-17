import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { StarshipsController } from './starships.controller';
import { StarshipsService } from './starships.service';
import { PeopleModule } from 'src/people/people.module';
import { FilmsModule } from 'src/films/films.module';

@Module({
  imports: [CommonModule, FilmsModule, forwardRef(() => PeopleModule)],
  controllers: [StarshipsController],
  providers: [StarshipsService],
  exports: [StarshipsService],
})
export class StarshipsModule {}
