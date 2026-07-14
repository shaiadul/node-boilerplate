import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
export const hashPasswordSync = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};
