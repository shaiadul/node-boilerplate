import { prisma } from '../../config/database';
import { IRefreshToken } from './auth.interface';

export class AuthRepository {
  async saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<IRefreshToken> {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string): Promise<IRefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async revokeRefreshToken(token: string): Promise<IRefreshToken> {
    return prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }
}
