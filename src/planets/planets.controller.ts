import { Controller, Get, Param } from '@nestjs/common';
import { PlanetsService } from './planets.service';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  async findAll() {
    return await this.planetsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.planetsService.findOne(id);
  }
}
