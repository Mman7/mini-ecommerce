export type SavedAddress = {
  id: number;
  userId: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

//  user data interface for the handleMe function
export interface AuthUserData {
  userId: string;
  name: string;
  email: string;
  role: string;
  deliveryAddress: SavedAddress[];
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
  udpatedAt: Date;
}
