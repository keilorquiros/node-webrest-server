import { Request, Response } from "express";

const todos = [
  {
    id: 1,
    text: "Buy milk",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    text: "Buy eggs",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    text: "Buy bread",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class TodoController {
  // DI
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "ID argument is not a number" });

    const todo = todos.find((todo) => todo.id === id);
    todo ? res.json(todo) : res.status(404).json({ message: "Todo not found" });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });
    const newTodo = {
      id: new Date().getTime() + Math.floor(Math.random() * 1000),
      text: text,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    todos.push(newTodo);
    return res.status(201).json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "ID argument is not a number" });

    const todo = todos.find((todo) => todo.id === id);

    if (!todo)
      return res.status(404).json({ message: `Todo with id ${id} not found` });

    const { text, isCompleted } = req.body;

    todo.text = text || todo.text;
    isCompleted === "undefined"
      ? (todo.isCompleted = todo.isCompleted)
      : (todo.isCompleted = Boolean(isCompleted));

    todo.updatedAt = new Date();
    res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "ID argument is not a number" });

    const todo = todos.find((todo) => todo.id === id);
    if (!todo)
      return res.status(404).json({ message: `Todo with id ${id} not found` });

    todos.splice(todos.indexOf(todo), 1);
    res.json(todo);
  };
}
