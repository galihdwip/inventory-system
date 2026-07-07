import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Product } from './product.entity';

@ObjectType()
@Entity('product_variants')
@Index(['sku'], { unique: true })
export class ProductVariant {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product: Product;

  @Field()
  @Column()
  sku: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', default: {} })
  attributes: Record<string, any>;
}

