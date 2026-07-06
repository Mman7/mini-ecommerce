import type { Request, Response } from "express";
import {
  registerAccount,
  loginAccount,
  logoutAccount,
  refreshAccessToken,
} from "./auth.service.ts";

// info after build auth, add simple validation using zod

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/", // Critical: Ensures cookies are accessible across all routes
};

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const { accessToken, refreshToken } = await loginAccount(email, password);

    return res
      .cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 30, // 30 分钟
      })
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 天
      })
      .status(200)
      .json({ message: "Login successful!" });
  } catch (error: Error | any) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ message: error.message });
    }

    // Fallback for other errors (e.g., missing credentials, database errors)
    return res.status(400).json({ message: error.message });
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 1. removed refresh token from database
    await logoutAccount(userId);

    // 2 . clear cookies
    return res
      .clearCookie("accessToken", COOKIE_OPTIONS)
      .clearCookie("refreshToken", COOKIE_OPTIONS)
      .status(200)
      .json({ message: "Logout successful!" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 *  @param req - Express Request object containing the registration details in the body
 *  @param res - Express Response object used to send back the appropriate HTTP response
 */
export const handleRegister = async (req: Request, res: Response) => {
  // all comments should be in english
  const { name, email, password } = req.body as RegisterBody;

  // 1. Basic frontend parameter validation (as the first line of defense, to avoid unnecessary database queries)
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  try {
    // 2. Call the Service layer to create a user and generate tokens
    const { accessToken, refreshToken } = await registerAccount(
      name,
      password,
      email,
    );

    // 3. Security best practice: write tokens to cookies, do not expose refreshToken in JSON response
    return res
      .cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 30, // 30 分钟
      })
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .status(201) // 201 Created status code is very appropriate for user creation
      .json({
        message: "Register successful!",
        accessToken, // If the frontend needs to use the accessToken for in-memory storage, it can be provided, but the refreshToken must never be exposed
      });
  } catch (error: any) {
    // 4. Map error status codes accurately
    if (
      error.message.includes("already exists") ||
      error.message.includes("registered")
    ) {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }

    // Other unknown errors (e.g., database down, invalid format, etc.)
    return res.status(400).json({ message: error.message });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  // decode the refresh token from the cookie
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const { accessToken } = await refreshAccessToken(refreshToken);

    return res
      .status(200)
      .json({ message: "Token refreshed successfully!", accessToken });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
