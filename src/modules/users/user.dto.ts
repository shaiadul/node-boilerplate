import { Role } from '@prisma/client';

export interface UpdateProfileDto {
  name?: string;
  email?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: Role;
  isVerified?: boolean;
}
