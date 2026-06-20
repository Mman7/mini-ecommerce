import express, { type Express } from "express";
import session from "express-session";
import dotenv from "dotenv";
import mainRouter from "./routes.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Built-in JSON parsing middleware
app.use(express.json());

const sessionSecret = process.env.SESSION_KEY;

if (!sessionSecret) {
  console.error("Error: SESSION_KEY is not defined in environment variables.");
  process.exit(1); // Exit the application if SESSION_KEY is missing
}

app.use(
  session({
    secret: sessionSecret as string, // Used to sign the session ID cookie
    resave: false, // Forces session to be saved back to store if unmodified
    saveUninitialized: false, // Don't create sessions until something is stored
    cookie: {
      maxAge: 60000, // Cookie expiration time in milliseconds (1 minute)
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Helps mitigate XSS attacks
    },
  }),
);

// Type-safe Route Handling
// Mount the main router under /api
app.use("/api", mainRouter);

// App initialization
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
