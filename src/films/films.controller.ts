import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll() {
    return await this.filmsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.filmsService.findOne(id);
  }

  @Get(':id/detail')
  async findFullDetailOfOne(@Param('id') id: string) {
    return await this.filmsService.findFullDetailOfOne(id);
  }
}
