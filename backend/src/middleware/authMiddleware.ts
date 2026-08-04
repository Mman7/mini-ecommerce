import type { JwtPayload } from "../interfaces/jwtpayload.interface.ts";
import { verifyAccessToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
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
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the access token and decode it
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded; // Attach the decoded payload to the request object
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
