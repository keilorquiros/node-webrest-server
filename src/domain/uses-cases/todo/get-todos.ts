import { TodoRepository, TodoEntity } from "../../index.js";

export interface GetTodosUseCase {
  execute(): Promise<TodoEntity[]>;
}

export class GetTodos implements GetTodosUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  execute(): Promise<TodoEntity[]> {
    return this.todoRepository.getAll();
  }
}
