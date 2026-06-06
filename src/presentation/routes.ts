import { Router } from "express";
import { TodoRoutes } from "./todos/routes";

export class AppRoutes {
  static get routes() {
    const router = Router();

    router.use("/api/todos", TodoRoutes.routes);
    return router;
  }
}
