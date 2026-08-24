export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserProfile {
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
