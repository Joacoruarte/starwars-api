import { Controller, Get, Param, Query } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get('')
  async findAll(@Query() { page, search }: { page?: string; search?: string }) {
    return await this.peopleService.findAll(page, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.peopleService.findOne(id);
  }
}
