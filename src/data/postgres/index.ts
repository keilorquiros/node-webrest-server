import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { envs } from "../../config/envs";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${envs.POSTGRES_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
