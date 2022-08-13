import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CreateCategoryInput } from './dtos/create-category.input';
import { UpdateCategoryInput } from './dtos/update-category.input';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../pipes/validation.pipe';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly service: CategoryService) {}

  @Query(() => Category)
  @UsePipes(ValidationPipe)
  async category(
    @Args('id')
    id: number,
  ): Promise<Category> {
    return await this.service.getOne(id);
  }

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await this.service.getAll();
  }

  @Mutation(() => Category)
  @UsePipes(ValidationPipe)
  async createCategory(
    @Args('input')
    input: CreateCategoryInput,
  ): Promise<Category> {
    return await this.service.create(input);
  }

  @Mutation(() => Category)
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Args('input')
    input: UpdateCategoryInput,
  ): Promise<Category> {
    return await this.service.update(input);
  }

  @Mutation(() => Category)
  @UsePipes(ValidationPipe)
  async removeCategory(
    @Args('id')
    id: number,
  ): Promise<number> {
    return await this.service.remove(id);
  }
}
