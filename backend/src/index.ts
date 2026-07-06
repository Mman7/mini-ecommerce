import express, { type Express } from "express";
import session from "express-session";
import dotenv from "dotenv";
import mainRouter from "./routes.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Built-in JSON parsing middleware
app.use(express.json());

// Type-safe Route Handling
// Mount the main router under /api
app.use("/api", mainRouter);

// App initialization
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
