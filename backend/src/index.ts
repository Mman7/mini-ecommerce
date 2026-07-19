import "dotenv/config";
import express, { type Express } from "express";
import mainRouter from "./routes.js";
import cookieParser from "cookie-parser";

const app: Express = express();
const port = process.env.PORT || 3000;

// Built-in JSON parsing middleware
app.use(express.json());
app.use(cookieParser());
// Custom middleware to enforce Content-Type for specific HTTP methods
app.use((req, res, next) => {
  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    !req.is("application/json")
  ) {
    return res.status(415).json({
      message: "Content-Type must be application/json",
    });
  }

  next();
});

// Type-safe Route Handling
// Mount the main router under /api
app.use("/api", mainRouter);

// App initialization
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
