import { TodoRepository, TodoEntity, UpdateTodoDto } from "../../index.js";

export interface UpdateTodoUseCase {
  execute(id: number, dto: UpdateTodoDto): Promise<TodoEntity>;
}

export class UpdateTodo implements UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  execute(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    return this.todoRepository.updateById(id, dto);
  }
}
