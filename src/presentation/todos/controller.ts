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

  public geAllTodos = (req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) =>
        res.status(500).json({ message: `Internal server error:\n ${error}` }),
      );
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "ID argument is not a number" });

    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(404).json({ message: `${error}` }));
  };

  public createTodo = (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    if (!createTodoDto)
      return res.status(400).json({ message: "Text is required" });

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto)
      .then((todo) => res.status(201).json(todo))
      .catch((error) =>
        res.status(400).json({ message: `Bad request:\n ${error}` }),
      );
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const previousTodo = await prisma.todo.findFirst({ where: { id: id } });
    if (!previousTodo)
      return res.status(404).json({ message: "Todo not found" });

    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id,
      previousTodo,
    });
    if (error) return res.status(400).json({ message: error });

    new UpdateTodo(this.todoRepository)
      .execute(id, updateTodoDto!)
      .then((updatedTodo) => res.json(updatedTodo))
      .catch((error) =>
        res.status(400).json({ message: `Bad request:\n ${error}` }),
      );
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "ID argument is not a number" });

    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((deletedTodo) => res.json({ deletedTodo, message: "Todo deleted" }))
      .catch((error) => res.status(404).json({ message: `${error}` }));
  };
}
