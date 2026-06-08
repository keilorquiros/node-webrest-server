import { config } from "dotenv";
config({ path: ".env.development" }); // Cambia '.env' por el nombre de tu archivo si es distinto
import envVar from "env-var";
const { get } = envVar;

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  PUBLIC_PATH: get("PUBLIC_PATH").required().asString(),

  POSTGRES_URL: get("POSTGRES_URL").required().asString(),
};
