import { InputType, Field, Float } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateVariantInput {
  @Field()
  sku: string;

  @Field(() => Float)
  price: number;

  @Field(() => GraphQLJSON, { nullable: true })
  attributes?: Record<string, any>;
}

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [CreateVariantInput], { nullable: 'itemsAndList' })
  variants?: CreateVariantInput[];
}
