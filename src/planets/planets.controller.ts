import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanetsService } from './planets.service';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  async findAll(@Query() { page, search }: { page?: string; search?: string }) {
    return await this.planetsService.findAll(page, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.planetsService.findOne(id);
  }

  @Get(':id/detail')
  async findFullDetailOfOne(@Param('id') id: string) {
    return this.planetsService.findFullDetailOfOne(id);
  }
}
