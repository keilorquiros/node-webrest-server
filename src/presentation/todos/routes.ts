import { Router } from "express";
import { TodoController } from "./controller.js";
import { TodoDataSourceImpl } from "../../infrastructure/datasources/todo.datasource.impl.js";
import { TodoRepositoryImpl } from "../../infrastructure/repositories/todo.repository.impl.js";

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new TodoDataSourceImpl();
    const todoRepository = new TodoRepositoryImpl(datasource);
    const todoController = new TodoController(todoRepository);

    router.get("/", todoController.geAllTodos);
    router.get("/:id", todoController.getTodoById);
    router.post("/", todoController.createTodo);
    router.put("/:id", todoController.updateTodo);
    router.delete("/:id", todoController.deleteTodo);

    return router;
  }
}
