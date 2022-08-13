import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Category } from '../category/category.entity';

interface TodoCreationAttrs {
  text: string;
  isCompleted: boolean;
  categoryId: number;
}

@ObjectType()
@Table({ timestamps: false, initialAutoIncrement: '1' })
export class Todo extends Model<Todo, TodoCreationAttrs> {
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
  text: string;

  @Field({ nullable: false })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isCompleted: boolean;

  @Field()
  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'cascade' })
  categoryId: number;

  @Field(() => Category, { nullable: true })
  @BelongsTo(() => Category, {
    as: 'category',
    onDelete: 'cascade',
  })
  category?: Category;
}
