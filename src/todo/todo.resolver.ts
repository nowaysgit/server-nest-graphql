import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { CreateTodoInput } from './dtos/create-todo.input';
import { UpdateTodoInput } from './dtos/update-todo.input';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../pipes/validation.pipe';
import { RemoveResponse } from '../dtos/removeResponse';

@Resolver('Todo')
export class TodoResolver {
  constructor(private readonly service: TodoService) {}

  @Query(() => Todo)
  @UsePipes(ValidationPipe)
  async todo(
    @Args('id')
    id: number,
  ): Promise<Todo> {
    return await this.service.getOne(id);
  }

  @Query(() => [Todo])
  async todos(): Promise<Todo[]> {
    return await this.service.getAll();
  }

  @Mutation(() => Todo)
  @UsePipes(ValidationPipe)
  async createTodo(
    @Args('input')
    input: CreateTodoInput,
  ): Promise<Todo> {
    return await this.service.create(input);
  }

  @Mutation(() => Todo)
  @UsePipes(ValidationPipe)
  async updateTodo(
    @Args('input')
    input: UpdateTodoInput,
  ): Promise<Todo> {
    return await this.service.update(input);
  }

  @Mutation(() => RemoveResponse)
  @UsePipes(ValidationPipe)
  async removeTodo(
    @Args('id')
    id: number,
  ): Promise<RemoveResponse> {
    return await this.service.remove(id);
  }
}
