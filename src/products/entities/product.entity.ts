import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { ProductVariant } from './product-variant.entity';

@ObjectType()
@Entity('products')
@Index(['tenantId'])
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => [ProductVariant], { nullable: 'itemsAndList' })
  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants: ProductVariant[];
}

