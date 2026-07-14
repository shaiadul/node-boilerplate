import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/response';
import { AUTH_MESSAGES } from './auth.constants';
import { getCookieOptions, getClearCookieOptions } from './auth.utils';
import { ApiError } from '../../utils/ApiError';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    sendResponse(res, 201, user, AUTH_MESSAGES.REGISTER_SUCCESS);
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token as string;
    await this.authService.verifyEmail(token);
    sendResponse(res, 200, null, AUTH_MESSAGES.EMAIL_VERIFIED);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    res.cookie('accessToken', result.accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', result.refreshToken, getCookieOptions('refresh'));

    sendResponse(
      res,
      200,
      { user: result.user, accessToken: result.accessToken },
      AUTH_MESSAGES.LOGIN_SUCCESS
    );
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie('accessToken', getClearCookieOptions());
    res.clearCookie('refreshToken', getClearCookieOptions());

    sendResponse(res, 200, null, AUTH_MESSAGES.LOGOUT_SUCCESS);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      throw new ApiError(401, 'Refresh token is missing.');
    }

    const result = await this.authService.refresh(token);

    res.cookie('accessToken', result.accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', result.refreshToken, getCookieOptions('refresh'));

    sendResponse(res, 200, { accessToken: result.accessToken }, AUTH_MESSAGES.REFRESH_SUCCESS);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.forgotPassword(req.body.email);
    sendResponse(res, 200, null, AUTH_MESSAGES.PASSWORD_RESET_LINK);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.body.token, req.body.newPassword);
    sendResponse(res, 200, null, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
  });
}
