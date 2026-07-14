import crypto from 'crypto';
import { UserRepository } from '../users/user.repository';
import { AuthRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthResult } from './auth.interface';
import { ApiError } from '../../utils/ApiError';
import { hashPassword, comparePassword } from '../../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/token';
import { sanitizeUser } from '../users/user.utils';
import { logger } from '../../config/logger';

export class AuthService {
  private userRepository: UserRepository;
  private authRepository: AuthRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterDto): Promise<any> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists.');
    }

    const hashedPassword = await hashPassword(data.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name || null,
      verificationToken,
      isVerified: false,
    });

    logger.info(`[AuthService] Verification token for ${newUser.email}: ${verificationToken}`);

    return sanitizeUser(newUser);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) {
      throw new ApiError(400, 'Invalid or expired email verification token.');
    }

    await this.userRepository.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });
  }

  async login(data: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await comparePassword(data.password, user.password as string);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    if (!user.isVerified) {
      throw new ApiError(403, 'Your email has not been verified. Please verify your email first.');
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    const refreshTokenRecord = await this.authRepository.findRefreshToken(token);
    if (refreshTokenRecord) {
      await this.authRepository.revokeRefreshToken(token);
    }
  }

  async refresh(token: string): Promise<Omit<AuthResult, 'user'>> {
    const refreshTokenRecord = await this.authRepository.findRefreshToken(token);

    if (
      !refreshTokenRecord ||
      refreshTokenRecord.isRevoked ||
      new Date() > refreshTokenRecord.expiresAt
    ) {
      throw new ApiError(401, 'Refresh token is invalid or has expired.');
    }

    const payload = verifyRefreshToken(token);
    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new ApiError(401, 'User no longer exists.');
    }

    const newPayload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await this.authRepository.revokeRefreshToken(token);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.authRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn(`[AuthService] Password reset requested for non-existent email: ${email}`);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await this.userRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    logger.info(`[AuthService] Password reset link for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByResetToken(token);

    if (!user || !user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new ApiError(400, 'Password reset token is invalid or has expired.');
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    await this.authRepository.revokeAllUserRefreshTokens(user.id);
  }
}
