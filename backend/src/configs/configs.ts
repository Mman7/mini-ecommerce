import Stripe from "stripe";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

const envFile =
  process.env.ENV_FILE === "docker" ? ".env.docker" : ".env.local";

console.log(`Using environment file: ${envFile}`);

const loadedEnv = dotenv.config({ path: envFile });
expand(loadedEnv);

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export default envFile;
