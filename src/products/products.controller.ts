import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateVariantDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateVariantDto } from './dto/update-product.dto';
import { TenantGuard } from '../tenants/tenant.guard';


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

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(req.tenantId, +id, updateProductDto);
  }

  @Post(':id/variants')
  async addVariant(@Req() req: any, @Param('id') id: string, @Body() createVariantDto: CreateVariantDto) {
    return this.productsService.addVariant(req.tenantId, +id, createVariantDto);
  }

  @Put(':id/variants')
  async updateVariant(@Req() req: any, @Param('id') id: string, @Body() UpdateVariantDto: UpdateVariantDto) {
    return this.productsService.updateVariant(req.tenantId, +id, UpdateVariantDto);
  }

  @Get('find/:id/variants')
  async getVariant(
    @Req() req: any, @Param('id') id: number) {
    return this.productsService.findVariant(req.tenantId, id);
  }
}
