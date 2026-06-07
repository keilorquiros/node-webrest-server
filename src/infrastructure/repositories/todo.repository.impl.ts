import {
  CreateTodoDto,
  TodoDataSource,
  TodoEntity,
  TodoRepository,
  UpdateTodoDto,
} from "../../domain/index.js";

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private readonly datasource: TodoDataSource) {}

  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.datasource.create(createTodoDto);
  }
  getAll(): Promise<TodoEntity[]> {
    return this.datasource.getAll();
  }
  getById(id: number): Promise<TodoEntity> {
    return this.datasource.getById(id);
  }
  updateById(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    return this.datasource.updateById(id, updateTodoDto);
  }
  deleteById(id: number): Promise<TodoEntity> {
    return this.datasource.deleteById(id);
  }
}
