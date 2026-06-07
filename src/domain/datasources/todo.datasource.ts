import { CreateTodoDto, UpdateTodoDto } from "../dtos/index.js";
import { TodoEntity } from "../entities/todo.entity.js";

export abstract class TodoDataSource {
  abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
  abstract getAll(): Promise<TodoEntity[]>;
  abstract getById(id: number): Promise<TodoEntity>;
  abstract updateById(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity>;
  abstract deleteById(id: number): Promise<TodoEntity>;
}
