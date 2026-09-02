export enum AuthStatus {
  Loading = "loading",
  Authenticated = "authenticated",
  Unauthenticated = "unauthenticated",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  userId: string;
  name: string;
  email: string;
  deliveryAddress: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
