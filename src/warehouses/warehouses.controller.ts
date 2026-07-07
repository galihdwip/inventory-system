import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto, AdjustStockDto } from './dto/create-warehouse.dto';
import { TenantGuard } from '../tenants/tenant.guard';

@Controller('warehouses')
@UseGuards(TenantGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  async create(@Req() req: any, @Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(req.tenantId, createWarehouseDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.warehousesService.findAll(req.tenantId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.warehousesService.findOne(req.tenantId, +id);
  }

  @Post(':id/stock')
  async adjustStock(@Req() req: any, @Param('id') id: string, @Body() adjustStockDto: AdjustStockDto) {
    return this.warehousesService.adjustStock(req.tenantId, +id, adjustStockDto);
  }

  @Get(':id/stock')
  async getWarehouseStock(@Req() req: any, @Param('id') id: string) {
    return this.warehousesService.getWarehouseStock(req.tenantId, +id);
  }

  @Get('variants/:variantId/stock')
  async getVariantStock(@Req() req: any, @Param('variantId') variantId: string) {
    return this.warehousesService.getVariantStock(req.tenantId, +variantId);
  }
}
