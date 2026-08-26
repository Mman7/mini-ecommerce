import type { AuthUserData, UserData } from "../interfaces/user.interface.ts";
import { verifyAccessToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserData;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { accessToken } = req.cookies ?? {};

  if (!accessToken) {
    return res.status(401).json({ message: "User is not login" });
  }

  try {
    // Verify the access token and decode it
    const decoded = verifyAccessToken(accessToken);
    const userData: AuthUserData = {
      userId: decoded.sub,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      deliveryAddress: [], // Initialize with an empty array; you may want to fetch this from the database if needed
      phoneNumber: null, // Initialize with null; you may want to fetch this from the database if needed
    };
    req.user = userData; // Attach the decoded payload to the request object
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }

  next();
};
