//  user data interface for the handleMe function
export interface AuthUserData {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface UserData {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  udpatedAt: Date;
}
