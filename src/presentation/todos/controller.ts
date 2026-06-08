import { Request, Response } from "express";
import { prisma } from "../../data/postgres/index.js";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos/index.js";
import {
  CreateTodo,
  DeleteTodo,
  GetTodo,
  GetTodos,
  UpdateTodo,
  TodoRepository,
  CustomError,
} from "../../domain/index.js";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoController {
  // DI
  constructor(private readonly todoRepository: TodoRepository) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    // Grabar log en Wiston
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  public geAllTodos = (req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => this.handleError(res, error));
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      this.handleError(
        res,
        new CustomError("ID argument is not a number", 400),
      );
    }
    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public createTodo = (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error: error });

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo) => res.status(201).json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const previousTodo = await this.todoRepository.getById(id);
      if (!previousTodo) throw new CustomError("Todo not found", 404);

      const [error, updateTodoDto] = UpdateTodoDto.create({
        ...req.body,
        id,
        previousTodo,
      });
      if (error) return res.status(400).json({ error });

      const updatedTodo = await new UpdateTodo(this.todoRepository).execute(
        id,
        updateTodoDto!,
      );
      res.json(updatedTodo);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((deletedTodo) => res.json({ deletedTodo, message: "Todo deleted" }))
      .catch((error) => this.handleError(res, error));
  };
}
