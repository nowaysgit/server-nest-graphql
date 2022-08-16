import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './todo.entity';
import { CreateTodoInput } from './dtos/create-todo.input';
import { UpdateTodoInput } from './dtos/update-todo.input';
import { Category } from '../category/category.entity';
import { RemoveResponse } from 'src/interfaces/RemoveResponse';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private repository: typeof Todo,
    @InjectModel(Category)
    private category: typeof Category,
  ) {}

  async create(input: CreateTodoInput): Promise<Todo> {
    let candidate = await this.category.findOne<Category>({
      where: { title: input.categoryName },
    });
    if (!candidate) {
      candidate = await this.category.create<Category>({
        title: input.categoryName,
      });
    }
    const todo = await this.repository.create<Todo>({
      text: input.text,
      categoryId: candidate.id,
    });
    return this.repository.findOne({
      where: { id: todo.id },
      include: { model: Category, as: 'category' },
    });
  }

  async getOne(id: number): Promise<Todo> {
    return await this.repository.findOne<Todo>({
      where: { id: id },
      include: { model: Category, as: 'category' },
    });
  }

  async getAll(): Promise<Todo[]> {
    return await this.repository.findAll<Todo>({
      order: [['id', 'ASC']],
      include: { model: Category, as: 'category' },
    });
  }

  async remove(id: number): Promise<RemoveResponse> {
    const candidate = await this.repository.findOne<Todo>({
      where: { id: id },
    });
    if (candidate) {
      await candidate.destroy();
      return { status: 1 };
    }
    return { status: 0 };
  }

  async update(input: UpdateTodoInput): Promise<Todo> {
    const candidate = await this.repository.findOne<Todo>({
      where: { id: input.id },
    });
    if (!candidate) {
      return null;
    }
    return await candidate.update({
      text: input.text,
      isCompleted: input.isCompleted,
      categoryId: input.categoryId,
    });
  }
}
