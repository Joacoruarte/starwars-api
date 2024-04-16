import { Controller, Get, Param, Query } from '@nestjs/common';
import { StarshipsService } from './starships.service';

@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Get()
  async findAll(@Query() { page, search }: { page?: string; search?: string }) {
    return this.starshipsService.findAll(page, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.starshipsService.findOne(id);
  }

  @Get(':id/detail')
  async findFullDetailOfOne(@Param('id') id: string) {
    return this.starshipsService.findFullDetailOfOne(id);
  }
}
