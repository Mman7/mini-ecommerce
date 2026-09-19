import { defineConfig, env } from "prisma/config";
import envFile from "./src/configs/configs.ts";

console.log(
  `Using environment file: ${envFile} from prisma.config.ts at ${new Date().toISOString()}`,
);

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
