import { Resolver, Query, Mutation, Args, ID, ObjectType, Field, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from './entities/warehouse.entity';
import { Stock } from './entities/stock.entity';
import { CreateWarehouseInput, AdjustStockInput } from './dto/create-warehouse.input';
import { TenantGuard } from '../tenants/tenant.guard';
import { CurrentTenantId } from '../tenants/current-tenant.decorator';

@ObjectType()
class VariantStockBreakdown {
  @Field()
  warehouseName: string;

  @Field(() => Int)
  quantity: number;
}

@Resolver(() => Warehouse)
@UseGuards(TenantGuard)
export class WarehousesResolver {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Query(() => [Warehouse], { name: 'warehouses' })
  async getWarehouses(@CurrentTenantId() tenantId: number): Promise<Warehouse[]> {
    return this.warehousesService.findAll(tenantId);
  }

  @Query(() => Warehouse, { name: 'warehouse', nullable: true })
  async getWarehouse(
    @CurrentTenantId() tenantId: number,
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Warehouse> {
    return this.warehousesService.findOne(tenantId, id);
  }

  @Mutation(() => Warehouse)
  async createWarehouse(
    @CurrentTenantId() tenantId: number,
    @Args('input') createWarehouseInput: CreateWarehouseInput,
  ): Promise<Warehouse> {
    return this.warehousesService.create(tenantId, createWarehouseInput);
  }

  @Mutation(() => Stock)
  async adjustStock(
    @CurrentTenantId() tenantId: number,
    @Args('warehouseId', { type: () => ID }) warehouseId: number,
    @Args('input') adjustStockInput: AdjustStockInput,
  ): Promise<Stock> {
    return this.warehousesService.adjustStock(tenantId, warehouseId, {
      productVariantId: Number(adjustStockInput.productVariantId),
      quantity: adjustStockInput.quantity,
    });
  }

  @Query(() => [Stock], { name: 'warehouseStock' })
  async getWarehouseStock(
    @CurrentTenantId() tenantId: number,
    @Args('warehouseId', { type: () => ID }) warehouseId: number,
  ): Promise<Stock[]> {
    return this.warehousesService.getWarehouseStock(tenantId, warehouseId);
  }

  @Query(() => [VariantStockBreakdown], { name: 'variantStock' })
  async getVariantStock(
    @CurrentTenantId() tenantId: number,
    @Args('variantId', { type: () => ID }) variantId: number,
  ): Promise<VariantStockBreakdown[]> {
    return this.warehousesService.getVariantStock(tenantId, variantId);
  }
}
