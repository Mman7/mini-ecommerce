import { comparePassword, hashPassword } from "../utils/password.ts";
import { prisma } from "../utils/prisma.ts";
import {
  signAccessToken,
  saveRefreshToken,
  signRefreshToken,
  validateUserRefreshToken,
  getUserRefreshToken,
  deleteRefreshToken,
} from "../utils/jwt.ts";

interface ServiceResponse {
  msg: string;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * @param name - The name of the user to register.
 * @param password - The password of the user to register.
 * @param email - The email of the user to register.
 * @returns A promise that resolves to a ServiceResponse object containing the registration result.
 */
export async function registerAccount(
  name: string,
  password: string,
  email: string,
): Promise<ServiceResponse> {
  // check email is unique
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw new Error("Email is already in use");

  //   create a new user in the database
  const hash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hash,
    },
  });

  const accessToken = signAccessToken(user.userId.toString());
  const refreshToken = signRefreshToken(user.userId.toString());

  await saveRefreshToken(refreshToken, user.userId);

  return {
    msg: "Register successful!",
    accessToken,
    refreshToken,
  };
}

/**
 * @param email - The emadil of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @returns return access token and refresh token if login is successful, otherwise throw an error.
 */
export async function loginAccount(
  email: string,
  password: string,
): Promise<ServiceResponse> {
  // check if email and password are provided
  if (!email || !password) throw new Error("Email and password are required");

  // check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("Invalid email or password");
  if (!user.passwordHash) throw new Error("User does not have a password set");

  // Generate access token and refresh token
  const passwordMatch = await comparePassword(password, user.passwordHash);
  if (passwordMatch) {
    const accessToken = signAccessToken(user.userId.toString());
    const refreshToken = signRefreshToken(user.userId.toString());

    await saveRefreshToken(refreshToken, user.userId);

    return {
      msg: "Login successful!",
      accessToken,
      refreshToken,
    };
  } else {
    throw new Error("Invalid email or password");
  }
}

export async function logoutAccount(userId: number): Promise<ServiceResponse> {
  // delete refresh token from database
  await deleteRefreshToken(userId);

  return { msg: "Logout successful!" };
}

/**
 * @param refreshToken - The refresh token provided by the user.
 * @returns A promise that resolves to a ServiceResponse object containing the new access token if the refresh is successful, otherwise throw an error.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<ServiceResponse> {
  try {
    const { trustedUserId } = await validateUserRefreshToken(refreshToken);

    const newAccessToken = signAccessToken(trustedUserId.toString());

    return {
      msg: "Token refreshed successfully!",
      accessToken: newAccessToken,
    };
  } catch (error: Error | any) {
    // 3. Cleaned up error handling mapping
    if (error.message === "Refresh token revoked or invalid") {
      throw new Error("Invalid refresh token");
    }

    if (error.message === "Refresh token expired or invalid") {
      throw new Error("Refresh token expired");
    }

    throw new Error("Invalid refresh token");
  }
}
