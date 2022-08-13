import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { Category } from '../category/category.entity';

@Module({
  imports: [SequelizeModule.forFeature([Todo, Category])],
  providers: [TodoService, TodoResolver],
  exports: [SequelizeModule],
})
export class TodoModule {}
