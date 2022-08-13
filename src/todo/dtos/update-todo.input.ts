import { Field, InputType, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class UpdateTodoInput {
  @IsNotEmpty({ message: 'ID must be specified' })
  @IsInt({ message: 'Must be number' })
  @Field(() => ID)
  id: number;

  @IsString({ message: 'Must be string' })
  @Length(1, 60, { message: 'Can only be 1 to 60 characters' })
  @Field({ nullable: true })
  text: string;

  @IsBoolean({ message: 'Must be boolean' })
  @Field({ nullable: true })
  isCompleted: boolean;

  @IsInt({ message: 'Must be number' })
  @Field({ nullable: true })
  categoryId: number;
}
