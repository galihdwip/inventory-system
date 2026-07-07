import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

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

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(+id, updateTenantDto.name, updateTenantDto.domain);
  }
}

