import { Controller, Get, Param } from '@nestjs/common';
import { SpeciesService } from './species.service';

@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  async findAll() {
    return await this.speciesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.speciesService.findOne(id);
  }

  @Get(':id/people')
  async findPeople(@Param('id') id: string) {
    return await this.speciesService.findPeople(id);
  }
}
