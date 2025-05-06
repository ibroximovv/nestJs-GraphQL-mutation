import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string

  @Field(() => Int)
  price: number

  @Field()
  color: string

  @Field(() => Int)
  categoryId: number
}
