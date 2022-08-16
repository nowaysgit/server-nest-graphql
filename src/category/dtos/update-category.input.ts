import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @IsNotEmpty({ message: 'ID must be specified' })
  @Field(() => ID)
  id: number;

  @IsString({ message: 'Must be string' })
  @Length(1, 255, { message: 'Can only be 1 to 255 characters' })
  @Field({ nullable: true })
  title: string;
}
