import { IUser } from './user.interface';

export const sanitizeUser = (user: any): Partial<IUser> => {
  if (!user) {
    return user;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...sanitized } = user;
  return sanitized;
};
