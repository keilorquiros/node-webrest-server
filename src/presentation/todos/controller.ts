import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

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
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "ID argument is not a number" });

    const todo = await prisma.todo.findFirst({
      where: { id: id },
    });
    todo ? res.json(todo) : res.status(404).json({ message: "Todo not found" });
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    if (!createTodoDto)
      return res.status(400).json({ message: "Text is required" });
    const todo = await prisma.todo.create({
      data: {
        text: createTodoDto.text,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res.status(201).json(todo);
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

    const updatedTodo = await prisma.todo.update({
      where: { id: id },
      data: {
        ...updateTodoDto!.values,
        updatedAt: new Date(),
      },
    });

    res.json(updatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "ID argument is not a number" });

    const todo = await prisma.todo.findFirst({ where: { id: id } });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    const deletedTodo = await prisma.todo.delete({ where: { id: id } });
    res.json({ todo: deletedTodo, message: "Todo deleted" });
  };
}
