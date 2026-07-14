import jwt from "jsonwebtoken";
import { prisma } from "./prisma.ts";

const accessSecretKey = process.env.JWT_ACCESS_SECRET;
const refreshSecretKey = process.env.JWT_REFRESH_SECRET;

interface TokenPayload {
  userId: string;
  email: string;
  iat: number; // Issued at (automatically added by JWT)
  exp: number; // Expiration time (automatically added by JWT)
}

if (!accessSecretKey || !refreshSecretKey) {
  throw new Error("JWT config is not defined in environment variables.");
}

// sign access token
// what does this function do? it takes a userId and an optional expiresIn parameter (defaulting to 30 minutes) and returns a signed JWT access token containing the userId as payload. The token is signed using the accessSecretKey and will expire after the specified duration.
/**
 * Fetches user data from the database.
 * @param userId - The ID of the user to fetch.
 * @returns string - jwt access token
 */
export const signAccessToken = (
  userId: string,
  expiresIn: jwt.SignOptions["expiresIn"] = "30m",
): string => {
  return jwt.sign({ userId }, accessSecretKey, { expiresIn });
};

/**
 * Generates a JWT refresh token for a user.
 * @param userId - The ID of the user for whom the token is generated.
 * @param expiresIn - Optional expiration time for the token (default is 7 days).
 * @returns string - jwt refresh token
 */
export const signRefreshToken = (
  userId: string,
  expiresIn: jwt.SignOptions["expiresIn"] = "7d",
): string => {
  return jwt.sign({ userId }, refreshSecretKey, { expiresIn });
};

// verify access token
export function verifyAccessToken(token: string): string | jwt.JwtPayload {
  if (!accessSecretKey)
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables.",
    );

  return jwt.verify(token, accessSecretKey);
}

/**
 * Verifies a JWT refresh token.
 * @param token - The JWT refresh token to verify.
 * @returns string | jwt.JwtPayload - The decoded token payload if valid.
 * @throws Error - If the token is invalid or the secret key is not defined.
 */
function verifyRefreshToken(token: string): string | jwt.JwtPayload {
  if (!refreshSecretKey)
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables.",
    );
  return jwt.verify(token, refreshSecretKey);
}

// save refresh token to database
export function saveRefreshToken(token: string, userId: number) {
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + sevenDays), // 7 days
    },
  });
}

export async function validateUserRefreshToken(
  refreshToken: string,
): Promise<{ trustedUserId: string; token: string }> {
  // 1. Verify the refresh token using the secret key
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken) as { userId: string };
  } catch {
    throw new Error("Refresh token expired or invalid");
  }

  // 2. Check if the refresh token exists in the database for the given userId
  const tokenInDB = await getUserRefreshToken(parseInt(decoded.userId));

  if (tokenInDB !== refreshToken) {
    throw new Error("Refresh token revoked or invalid");
  }

  return { trustedUserId: decoded.userId, token: refreshToken };
}

export async function getUserRefreshToken(userId: number): Promise<string> {
  return prisma.refreshToken
    .findFirst({
      where: { userId: userId },
    })
    .then((token) => {
      if (!token) throw new Error("Refresh token not found");
      return token.token;
    });
}

// will implement device based refresh token, and will delete the refresh token for the user
export async function deleteRefreshToken(userId: number) {
  return prisma.refreshToken
    .deleteMany({
      where: { userId: userId },
    })
    .then((result) => {
      if (result.count === 0) throw new Error("Refresh token not found");
      return result;
    });
}

export function parseAccessToken(token: string): TokenPayload | null {
  // Your secret key used to sign the token (keep this in your .env file)

  try {
    // jwt.verify throws an error if the token is invalid or expired
    if (!accessSecretKey) {
      throw new Error("Access secret key is not defined");
    }
    const decoded = jwt.verify(token, accessSecretKey) as TokenPayload;
    return decoded;
  } catch (error) {
    // Token is expired, invalid, or malformed
    console.error("JWT verification failed:", error);
    return null;
  }
}
