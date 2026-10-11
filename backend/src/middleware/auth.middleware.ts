import type { AuthUserData, UserData } from "../interfaces/user.interface.ts";
import { verifyAccessToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserData;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { accessToken } = req.cookies ?? {};
  if (!accessToken) {
    return res.status(401).json({ message: "User is not login" });
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({
      where: { userId: decoded.sub },
      select: {
        userId: true,
        role: true,
        name: true,
        email: true,
        phoneNumber: true,
        isActive: true,
      },
    });
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: "Account is inactive or unavailable" });
    }

    const userData: AuthUserData = {
      userId: user.userId,
      role: user.role,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    req.user = userData;
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
