import { Sequelize } from 'sequelize-typescript';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { Todo } from '../todo/todo.entity';
import { createMemDB } from '../utils/testing-helpers/createMemDb';
import { createTestData } from '../utils/testing-helpers/modelFactories';
import { CategoryDto } from './dtos/category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let memDb: Sequelize;

  beforeAll(async () => {
    memDb = await createMemDB([Category, Todo]);

    service = new CategoryService(Category);

    return await createTestData();
  });
  afterAll(async () => {
    await Todo.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });
    return await memDb.close();
  });

  describe('success', () => {
    it('getOne', async () => {
      const target: Category = await service.getOne(1);
      const need: Category = await Category.findOne<Category>({
        where: { id: 1 },
        order: [[{ model: Todo, as: 'todos' }, 'id', 'ASC']],
        include: { model: Todo, as: 'todos' },
      });

      expect(target).toEqual(need);
      expect(target).toMatchObject({
        id: 1,
        title: 'Семья',
        todos: [
          {
            id: 1,
            text: 'Купить молоко',
            isCompleted: false,
            categoryId: 1,
          },
          {
            id: 2,
            text: 'Заменить масло в двигателе до 23 апреля',
            isCompleted: true,
            categoryId: 1,
          },
          {
            id: 3,
            text: 'Заплатить за квартиру',
            isCompleted: false,
            categoryId: 1,
          },
          {
            id: 4,
            text: 'Забрать обувь из ремонта',
            isCompleted: false,
            categoryId: 1,
          },
        ],
      });
    });

    it('getAll', async () => {
      const target: Category[] = await service.getAll();
      const need: Category[] = await Category.findAll<Category>({
        order: [
          ['id', 'ASC'],
          [{ model: Todo, as: 'todos' }, 'id', 'ASC'],
        ],
        include: { model: Todo, as: 'todos' },
      });

      const data = [
        {
          id: 1,
          title: 'Семья',
          todos: [
            {
              id: 1,
              text: 'Купить молоко',
              isCompleted: false,
              categoryId: 1,
            },
            {
              id: 2,
              text: 'Заменить масло в двигателе до 23 апреля',
              isCompleted: true,
              categoryId: 1,
            },
            {
              id: 3,
              text: 'Заплатить за квартиру',
              isCompleted: false,
              categoryId: 1,
            },
            {
              id: 4,
              text: 'Забрать обувь из ремонта',
              isCompleted: false,
              categoryId: 1,
            },
          ],
        },
        {
          id: 2,
          title: 'Работа',
          todos: [
            {
              id: 5,
              text: 'Позвонить заказчику',
              isCompleted: true,
              categoryId: 2,
            },
            {
              id: 6,
              text: 'Отправить документы',
              isCompleted: true,
              categoryId: 2,
            },
            {
              id: 7,
              text: 'Заполнить отчет',
              isCompleted: false,
              categoryId: 2,
            },
          ],
        },
        {
          id: 3,
          title: 'Прочее',
          todos: [
            {
              id: 8,
              text: 'Позвонить другу',
              isCompleted: false,
              categoryId: 3,
            },
            {
              id: 9,
              text: 'Подготовиться к поездке',
              isCompleted: false,
              categoryId: 3,
            },
          ],
        },
      ];
      expect(target).toEqual(need);
      expect(target).toMatchObject(data);
    });

    it('update', async () => {
      const before: Category = await Category.findOne<Category>({
        where: { id: 1 },
      });
      const target: Category = await service.update({
        id: 1,
        title: 'TEST',
      });
      const need: Category = await Category.findOne<Category>({
        where: { id: 1 },
      });
      expect(new CategoryDto(target)).toEqual({
        id: 1,
        title: 'TEST',
      });
      expect(target).toEqual(need);
      expect(before).not.toEqual(need);
    });

    it('create', async () => {
      const target = await service.create({
        title: 'TEST',
      });
      expect(target).not.toEqual(null);
      const need = await Category.findOne({ where: { id: target.id } });
      expect(new CategoryDto(target)).toEqual({
        id: target.id,
        title: 'TEST',
        todos: [],
      });
      expect(new CategoryDto(need)).toEqual({
        id: target.id,
        title: 'TEST',
      });
    });

    it('remove', async () => {
      const target = await service.remove(1);
      const need = await Category.findOne({ where: { id: 1 } });
      expect(target).toEqual({ status: 1 });
      expect(need).toEqual(null);
    });
  });
});
