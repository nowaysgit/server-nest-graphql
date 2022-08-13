import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Todo } from '../todo/todo.entity';

interface CategoryCreationAttrs {
  title: string;
}

@ObjectType()
@Table({ timestamps: false, initialAutoIncrement: '1' })
export class Category extends Model<Category, CategoryCreationAttrs> {
  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Field({ nullable: true })
  @Column({ type: DataType.STRING, allowNull: true })
  title: string;

  @Field(() => [Todo], { nullable: true })
  @HasMany(() => Todo, { as: 'todos' })
  todos: Todo[];
}
