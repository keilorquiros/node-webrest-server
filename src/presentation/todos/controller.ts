import { Request, Response } from "express";

const todos = [
  { id: 1, text: "Buy milk", createdAt: new Date(), isCompleted: false },
  { id: 2, text: "Buy eggs", createdAt: new Date(), isCompleted: false },
  { id: 3, text: "Buy bread", createdAt: new Date(), isCompleted: false },
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
      createdAt: new Date(),
      isCompleted: false,
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
