import { TodoDto } from '../../todo/dtos/todo.dto';

export class CategoryDto {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.todos = data?.todos;
  }
  id: number;
  title: string;
  todos?: TodoDto[];
}
