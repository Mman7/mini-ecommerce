import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

const envFile =
  process.env.ENV_FILE === "docker" ? ".env.docker" : ".env.local";
expand(dotenv.config({ path: envFile }));

console.log(
  `Using environment file: ${envFile} from prisma.config.ts at ${new Date().toISOString()}`,
);

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
