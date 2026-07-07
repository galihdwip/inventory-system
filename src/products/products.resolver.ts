import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductInput, CreateVariantInput } from './dto/create-product.input';
import { TenantGuard } from '../tenants/tenant.guard';
import { CurrentTenantId } from '../tenants/current-tenant.decorator';
import GraphQLJSON from 'graphql-type-json';

@Resolver(() => Product)
@UseGuards(TenantGuard)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product], { name: 'products' })
  async getProducts(
    @CurrentTenantId() tenantId: number,
    @Args('filter', { type: () => GraphQLJSON, nullable: true }) filter?: Record<string, string>,
  ): Promise<Product[]> {
    return this.productsService.findAll(tenantId, filter || {});
  }

  @Query(() => Product, { name: 'product', nullable: true })
  async getProduct(
    @CurrentTenantId() tenantId: number,
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Product> {
    return this.productsService.findOne(tenantId, id);
  }

  @Mutation(() => Product)
  async createProduct(
    @CurrentTenantId() tenantId: number,
    @Args('input') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create(tenantId, createProductInput);
  }

  @Mutation(() => ProductVariant)
  async addProductVariant(
    @CurrentTenantId() tenantId: number,
    @Args('productId', { type: () => ID }) productId: number,
    @Args('input') createVariantInput: CreateVariantInput,
  ): Promise<ProductVariant> {
    return this.productsService.addVariant(tenantId, productId, createVariantInput);
  }
}
