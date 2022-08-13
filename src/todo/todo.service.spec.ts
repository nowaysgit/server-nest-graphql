import { Sequelize } from 'sequelize-typescript';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { Category } from '../category/category.entity';
import { createMemDB } from '../utils/testing-helpers/createMemDb';
import { createTestData } from '../utils/testing-helpers/modelFactories';

describe('TodoService', () => {
  let service: TodoService;
  let memDb: Sequelize;

  beforeAll(async () => {
    memDb = await createMemDB([Todo, Category]);

    service = new TodoService(Todo, Category);

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
      const target: Todo = await service.getOne(1);
      const need: Todo = await Todo.findOne<Todo>({
        where: { id: 1 },
        include: { model: Category, as: 'category' },
      });

      expect(target).toEqual(need);
    });

    it('getAll', async () => {
      const target: Todo[] = await service.getAll();
      const need: Todo[] = await Todo.findAll<Todo>({
        order: [['id', 'ASC']],
        include: { model: Category, as: 'category' },
      });

      expect(target).toEqual(need);
      expect(target).toMatchObject([
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
      ]);
    });

    it('update', async () => {
      const before: Todo = await Todo.findOne<Todo>({ where: { id: 1 } });
      const target: Todo = await service.update({
        id: 1,
        text: 'TEST',
        isCompleted: true,
        categoryId: 2,
      });
      const need: Todo = await Todo.findOne<Todo>({ where: { id: 1 } });
      expect(target).toMatchObject({
        id: 1,
        text: 'TEST',
        isCompleted: true,
        categoryId: 2,
      });
      expect(target).toEqual(need);
      expect(before).not.toEqual(need);
    });

    it('create', async () => {
      const target = await service.create({
        text: 'TEST',
        categoryName: 'Работа',
      });
      expect(target).not.toEqual(null);
      const need = await Todo.findOne({ where: { id: target.id } });
      expect(target).toMatchObject({
        category: { id: 2, title: 'Работа' },
        categoryId: 2,
        id: target.id,
        isCompleted: false,
        text: 'TEST',
      });
      expect(need).toMatchObject({
        categoryId: 2,
        id: target.id,
        isCompleted: false,
        text: 'TEST',
      });
    });

    it('create with category', async () => {
      const target = await service.create({
        text: 'TEST2',
        categoryName: 'TestCategory',
      });
      expect(target).not.toEqual(null);
      const need = await Todo.findOne({ where: { id: target.id } });
      expect(target).toMatchObject({
        category: { id: 4, title: 'TestCategory' },
        categoryId: 4,
        id: target.id,
        isCompleted: false,
        text: 'TEST2',
      });
      expect(need).toMatchObject({
        id: target.id,
        text: 'TEST2',
        isCompleted: false,
        categoryId: 4,
      });
    });

    it('remove', async () => {
      const target = await service.remove(1);
      const need = await Todo.findOne({ where: { id: 1 } });
      expect(target).toEqual(1);
      expect(need).toEqual(null);
    });
  });
});
