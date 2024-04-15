import { Controller, Get, Param } from '@nestjs/common';
import { StarshipsService } from './starships.service';

@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Get()
  async findAll() {
    return this.starshipsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.starshipsService.findOne(id);
  }
}
