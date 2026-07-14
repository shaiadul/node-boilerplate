import { Role } from '@prisma/client';

export interface IUser {
  id: string;
  email: string;
  password?: string;
  name: string | null;
  role: Role;
  isVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
