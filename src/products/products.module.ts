import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariant])],
  providers: [ProductsService, ProductsResolver],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}

