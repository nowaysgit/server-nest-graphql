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
  @Field(() => ID)
  id: number;

  @IsString({ message: 'Must be string' })
  @Length(1, 255, { message: 'Can only be 1 to 255 characters' })
  @Field({ nullable: true })
  text: string;

  @IsBoolean({ message: 'Must be boolean' })
  @Field({ nullable: true })
  isCompleted: boolean;

  @IsInt({ message: 'Must be number' })
  @Field({ nullable: true })
  categoryId: number;
}
