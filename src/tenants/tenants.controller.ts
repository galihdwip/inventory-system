import { Controller, Get, Post, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async create(@Body() body: { name: string; domain: string }) {
    return this.tenantsService.create(body.name, body.domain);
  }

  @Get()
  async findAll() {
    return this.tenantsService.findAll();
  }
}
