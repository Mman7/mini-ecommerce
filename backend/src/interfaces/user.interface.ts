export type SavedAddress = {
  id: number;
  userId: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

//  user data interface for the handleMe function
// this shoudnt return location, location should treat as separate entity,
// and user can have multiple locations, so location should be a separate
// table with a foreign key to the user table
export interface AuthUserData {
  userId: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserData {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
