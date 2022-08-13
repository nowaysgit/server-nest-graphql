import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsString({ message: 'Must be string' })
  @Length(1, 30, { message: 'Can only be 1 to 30 characters' })
  @Field({ nullable: true })
  title: string;
}
