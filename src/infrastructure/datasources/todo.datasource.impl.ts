import { prisma } from "../../data/postgres/index.js";
import {
  CreateTodoDto,
  CustomError,
  TodoDataSource,
  TodoEntity,
  UpdateTodoDto,
} from "../../domain/index.js";

export class TodoDataSourceImpl implements TodoDataSource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const newTodo = await prisma.todo.create({
      data: {
        text: createTodoDto.text,
      },
    });
    return TodoEntity.fromObject(newTodo);
  }
  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany();
    return todos.map((todo) => TodoEntity.fromObject(todo));
  }
  async getById(id: number): Promise<TodoEntity> {
    try {
      const todo = await prisma.todo.findFirst({ where: { id: id } });
      if (!todo) throw new CustomError(`Todo with id ${id} not found`, 404);
      return TodoEntity.fromObject(todo);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(`Internal Server Error: ${error}`, 500);
    }
  }
  async updateById(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    const updatedTodo = await prisma.todo.update({
      where: { id: id },
      data: {
        ...updateTodoDto.values,
        updatedAt: new Date(),
      },
    });
    return TodoEntity.fromObject(updatedTodo);
  }
  async deleteById(id: number): Promise<TodoEntity> {
    const previousTodo = await this.getById(id);
    const deletedTodo = await prisma.todo.delete({ where: { id: id } });
    return TodoEntity.fromObject(deletedTodo);
  }
}
