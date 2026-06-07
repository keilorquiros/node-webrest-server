import "dotenv/config";
import envVar from "env-var";
const { get } = envVar;

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  PUBLIC_PATH: get("PUBLIC_PATH").required().asString(),

  POSTGRES_URL: get("POSTGRES_URL").required().asString(),
};
