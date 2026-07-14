import { IUser } from '../users/user.interface';

export interface AuthResult {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}
export interface IRefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
