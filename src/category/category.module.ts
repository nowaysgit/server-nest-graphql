import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { Todo } from '../todo/todo.entity';

@Module({
  imports: [SequelizeModule.forFeature([Category, Todo])],
  providers: [CategoryService, CategoryResolver],
  exports: [SequelizeModule],
})
export class CategoryModule {}
