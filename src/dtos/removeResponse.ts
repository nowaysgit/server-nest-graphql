import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveResponse {
  @Field({ nullable: false })
  status: number;
}
