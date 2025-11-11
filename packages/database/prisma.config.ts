import { resolve } from "path";
import { defineConfig, env } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: resolve(__dirname, "../../.env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});