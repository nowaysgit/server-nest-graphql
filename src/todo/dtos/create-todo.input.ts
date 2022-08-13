import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @IsString({ message: 'Must be string' })
  @Length(1, 30, { message: 'Can only be 1 to 30 characters' })
  @Field({ nullable: true })
  categoryName: string;

  @IsString({ message: 'Must be string' })
  @Length(1, 60, { message: 'Can only be 1 to 60 characters' })
  @Field({ nullable: true })
  text: string;
}
