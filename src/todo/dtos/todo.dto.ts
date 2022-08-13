import { Category } from '../../category/category.entity';

export class TodoDto {
  constructor(data) {
    this.id = data.id;
    this.text = data.text;
    this.isCompleted = data.isCompleted;
    this.categoryId = data.categoryId;
    this.category = data?.category;
  }
  id: number;
  text: string;
  isCompleted: boolean;
  categoryId: number;
  category?: Category;
}
