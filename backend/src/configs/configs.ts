const envFile =
  process.env.ENV_FILE === "docker" ? ".env.docker" : ".env.local";

console.log(`Using environment file: ${envFile}`);

import dotenv from "dotenv";
import { expand } from "dotenv-expand";

const loadedEnv = dotenv.config({ path: envFile });
expand(loadedEnv);

export default envFile;
