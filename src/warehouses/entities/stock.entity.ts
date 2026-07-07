import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@ObjectType()
@Entity('stocks')
@Unique(['warehouseId', 'productVariantId'])
export class Stock {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  warehouseId: number;

  @Field(() => Warehouse)
  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  warehouse: Warehouse;

  @Field(() => ID)
  @Column()
  productVariantId: number;

  @Field(() => ProductVariant)
  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  productVariant: ProductVariant;

  @Field(() => Int)
  @Column({ default: 0 })
  quantity: number;
}

