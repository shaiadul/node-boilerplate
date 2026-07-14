import { CookieOptions } from 'express';
import { env } from '../../config/env';

export const getCookieOptions = (type: 'access' | 'refresh'): CookieOptions => {
  const isProd = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge:
      type === 'access'
        ? 15 * 60 * 1000 // 15 mins
        : 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};
export const getClearCookieOptions = (): CookieOptions => {
  const isProd = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };
};
