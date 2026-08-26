import { comparePassword, hashPassword } from "../../utils/password.ts";
import { prisma } from "../../utils/prisma.ts";
import {
  signAccessToken,
  saveRefreshToken,
  signRefreshToken,
  validateUserRefreshToken,
  deleteRefreshToken,
} from "../../utils/jwt.ts";
import type {
  AuthUserData,
  UserData,
} from "../../interfaces/user.interface.ts";

interface ServiceResponse {
  msg: string;
  user?: Partial<UserData>;
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

  const accessToken = signAccessToken({
    sub: user.userId.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
  });

  const refreshToken = signRefreshToken(user.userId.toString());

  await saveRefreshToken(refreshToken, user.userId);

  return {
    msg: "Register successful!",
    user,
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
    // Generate access token and refresh token
    const accessToken = signAccessToken({
      sub: user.userId.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    });
    // Generate refresh token and save it to the database
    const refreshToken = signRefreshToken(user.userId);
    await saveRefreshToken(refreshToken, user.userId);

    const buildUserData: AuthUserData = {
      userId: user.userId.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
      deliveryAddress: [], // Add an empty array for deliveryAddress
      phoneNumber: user.phoneNumber ?? null,
    };

    return {
      msg: "Login successful!",
      user: buildUserData,
      accessToken,
      refreshToken,
    };
  } else {
    throw new Error("Invalid email or password");
  }
}

export async function logoutAccount(
  refreshToken: string,
): Promise<ServiceResponse> {
  // delete refresh token from database
  await deleteRefreshToken(refreshToken);

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
    const { userId, email, role, name } = await prisma.user.findUniqueOrThrow({
      where: { userId: trustedUserId },
      select: { userId: true, email: true, role: true, name: true },
    });

    const newAccessToken = signAccessToken({
      sub: trustedUserId,
      role: role,
      email: email,
      name: name,
    });

    // remove the old refresh token from the database
    await deleteRefreshToken(refreshToken);

    const newRefreshToken = signRefreshToken(userId);
    await saveRefreshToken(newRefreshToken, userId);

    return {
      msg: "Token refreshed successfully!",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error: Error | any) {
    switch (error.message) {
      case "Refresh token revoked or invalid":
        throw new Error("Invalid refresh token");

      case "Refresh token expired or invalid":
        throw new Error("Refresh token expired");

      default:
        throw new Error("Invalid refresh token");
    }
  }
}
