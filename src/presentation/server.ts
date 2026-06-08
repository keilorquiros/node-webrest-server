import express, { Router } from "express";
import path from "path";

interface Options {
  port: number;
  publicPath?: string;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, publicPath, routes } = options;
    this.port = port;
    this.publicPath = publicPath || "public";
    this.routes = routes;
  }
  async start() {
    //* Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    //* Public Folders
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.routes);

    // Usar '*' para capturar todas las rutas no definidas (SPA)
    this.app.get("/{*splat}", (req, res) => {
      const indexPath = path.resolve(
        process.cwd(),
        this.publicPath,
        "index.html",
      );
      res.sendFile(indexPath);
      return;
    });

    this.serverListener = await this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener.close();
  }
}
