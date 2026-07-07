import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class CreateWarehouseInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  location?: string;
}

@InputType()
export class AdjustStockInput {
  @Field(() => ID)
  productVariantId: number;

  @Field(() => Int)
  quantity: number;
}
