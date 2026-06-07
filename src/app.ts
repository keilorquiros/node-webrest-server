import { envs } from "./config/envs.js";
import { AppRoutes } from "./presentation/routes.js";
import { Server } from "./presentation/server.js";

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: envs.PORT,
    publicPath: envs.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });
  server.start();
}
