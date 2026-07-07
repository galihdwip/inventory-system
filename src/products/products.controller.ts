import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateVariantDto } from './dto/create-product.dto';
import { TenantGuard } from '../tenants/tenant.guard';
import { CurrentTenantId } from 'src/tenants/current-tenant.decorator';

@Controller('products')
@UseGuards(TenantGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Req() req: any, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(req.tenantId, createProductDto);
  }

  @Get()
  async findAll(@Req() req: any, @Query() query: Record<string, string>) {
    return this.productsService.findAll(req.tenantId, query);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.productsService.findOne(req.tenantId, +id);
  }

  @Post(':id/variants')
  async addVariant(@Req() req: any, @Param('id') id: string, @Body() createVariantDto: CreateVariantDto) {
    return this.productsService.addVariant(req.tenantId, +id, createVariantDto);
  }

  @Get('find/:id/variants')
  async getVariant(
    @Req() req: any, @Param('id') id: number) {
    return this.productsService.findVariant(req.tenantId, id);
  }
}
