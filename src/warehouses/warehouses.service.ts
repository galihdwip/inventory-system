import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Stock } from './entities/stock.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CreateWarehouseDto, AdjustStockDto } from './dto/create-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) { }

  async create(tenantId: number, createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = this.warehouseRepository.create({
      ...createWarehouseDto,
      tenantId,
    });
    return await this.warehouseRepository.save(warehouse);
  }

  async findAll(tenantId: number): Promise<Warehouse[]> {
    return await this.warehouseRepository.find({ where: { tenantId } });
  }

  async findOne(tenantId: number, id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({ where: { id, tenantId } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async adjustStock(tenantId: number, warehouseId: number, adjustStockDto: AdjustStockDto): Promise<Stock> {
    await this.findOne(tenantId, warehouseId);

    const variant = await this.variantRepository.findOne({
      where: { id: adjustStockDto.productVariantId },
      relations: { product: true },
    });

    if (!variant || variant.product.tenantId !== tenantId) {
      throw new NotFoundException(`Product Variant with ID ${adjustStockDto.productVariantId} not found under this tenant`);
    }

    let stock = await this.stockRepository.findOne({
      where: { warehouseId, productVariantId: adjustStockDto.productVariantId },
    });

    if (!stock) {
      stock = this.stockRepository.create({
        warehouseId,
        productVariantId: adjustStockDto.productVariantId,
        quantity: 0,
      });
    }

    stock.quantity = adjustStockDto.quantity;
    return await this.stockRepository.save(stock);
  }

  async getWarehouseStock(tenantId: number, warehouseId: number): Promise<Stock[]> {
    await this.findOne(tenantId, warehouseId);

    return await this.stockRepository.find({
      where: { warehouseId },
      relations: { productVariant: { product: true } },
    });
  }

  async getVariantStock(tenantId: number, variantId: number): Promise<{ warehouseName: string; quantity: number }[]> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
      relations: { product: true },
    });

    if (!variant || variant.product.tenantId !== tenantId) {
      throw new NotFoundException(`Product Variant with ID ${variantId} not found under this tenant`);
    }

    const stocks = await this.stockRepository.find({
      where: { productVariantId: variantId },
      relations: { warehouse: true },
    });

    return stocks.map(s => ({
      warehouseName: s.warehouse.name,
      quantity: s.quantity,
    }));
  }
}
