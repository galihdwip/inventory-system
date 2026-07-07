import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Stock } from './entities/stock.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { WarehousesResolver } from './warehouses.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Stock, ProductVariant])],
  providers: [WarehousesService, WarehousesResolver],
  controllers: [WarehousesController],
  exports: [WarehousesService],
})
export class WarehousesModule {}

