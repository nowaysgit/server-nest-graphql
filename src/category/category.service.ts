import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.entity';
import { UpdateCategoryInput } from './dtos/update-category.input';
import { CreateCategoryInput } from './dtos/create-category.input';
import { Todo } from '../todo/todo.entity';
import { RemoveResponse } from 'src/dtos/removeResponse';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private repository: typeof Category,
  ) {}

  async getOne(id: number): Promise<Category> {
    return await this.repository.findOne<Category>({
      where: { id: id },
      order: [[{ model: Todo, as: 'todos' }, 'id', 'ASC']],
      include: { model: Todo, as: 'todos' },
    });
  }

  async getAll(): Promise<Category[]> {
    return await this.repository.findAll<Category>({
      order: [
        ['id', 'ASC'],
        [{ model: Todo, as: 'todos' }, 'id', 'ASC'],
      ],
      include: { model: Todo, as: 'todos' },
    });
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const category = await this.repository.create<Category>(input);
    return this.repository.findOne({
      where: { id: category.id },
      order: [[{ model: Todo, as: 'todos' }, 'id', 'ASC']],
      include: { model: Todo, as: 'todos' },
    });
  }

  async update(input: UpdateCategoryInput): Promise<Category> {
    const candidate = await this.repository.findOne<Category>({
      where: { id: input.id },
    });
    if (!candidate) {
      return null;
    }
    return await candidate.update({
      title: input.title,
    });
  }

  async remove(id: number): Promise<RemoveResponse> {
    try {
      const candidate = await this.repository.findOne<Category>({
        where: { id: id },
      });
      if (candidate) {
        await candidate.destroy({ force: true });
        return { status: 1 };
      }
      return { status: 0 };
    } catch (e) {
      console.log(e);
    }
  }
}
