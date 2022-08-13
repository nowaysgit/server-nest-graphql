import { Category } from '../../category/category.entity';
import { Todo } from '../../todo/todo.entity';

async function createCategory(id: number, title: string) {
  const candidate = await Category.findOne({
    where: {
      id: id,
    },
  });
  if (candidate) {
    candidate.title = title;
    await candidate.save();
  } else {
    await Category.create({
      title: title,
    });
  }
}

async function createTodo(
  id: number,
  text: string,
  isCompleted: boolean,
  categoryId: number,
) {
  const candidate = await Todo.findOne({
    where: {
      id: id,
    },
  });
  if (candidate) {
    candidate.text = text;
    candidate.isCompleted = isCompleted;
    candidate.categoryId = categoryId;
    await candidate.save();
  } else {
    await Todo.create({
      text: text,
      isCompleted: isCompleted,
      categoryId: categoryId,
    });
  }
}

async function createTestData() {
  await createCategory(1, 'Семья');
  await createCategory(2, 'Работа');
  await createCategory(3, 'Прочее');

  await createTodo(1, 'Купить молоко', false, 1);
  await createTodo(2, 'Заменить масло в двигателе до 23 апреля', true, 1);
  await createTodo(3, 'Заплатить за квартиру', false, 1);
  await createTodo(4, 'Забрать обувь из ремонта', false, 1);

  await createTodo(5, 'Позвонить заказчику', true, 2);
  await createTodo(6, 'Отправить документы', true, 2);
  await createTodo(7, 'Заполнить отчет', false, 2);

  await createTodo(8, 'Позвонить другу', false, 3);
  await createTodo(9, 'Подготовиться к поездке', false, 3);
}

export { createCategory, createTodo, createTestData };
