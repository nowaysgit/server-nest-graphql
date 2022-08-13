import { Field, InputType, ID } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @IsNotEmpty({ message: 'ID must be specified' })
  @IsInt({ message: 'Must be number' })
  @Field(() => ID)
  id: number;

  @IsString({ message: 'Must be string' })
  @Length(1, 30, { message: 'Can only be 1 to 30 characters' })
  @Field({ nullable: true })
  title: string;
}
