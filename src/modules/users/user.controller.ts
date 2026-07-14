import { Request, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/response';
import { USER_MESSAGES } from './user.constants';
import { getPaginationMeta } from '../../utils/pagination';
import { sanitizeUser } from './user.utils';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await this.userService.getUserById(req.user!.id);
    sendResponse(res, 200, sanitizeUser(user), USER_MESSAGES.FETCHED);
  });

  updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await this.userService.updateProfile(req.user!.id, req.body);
    sendResponse(res, 200, sanitizeUser(user), USER_MESSAGES.PROFILE_UPDATED);
  });

  changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.userService.changePassword(req.user!.id, req.body);
    sendResponse(res, 200, null, USER_MESSAGES.PASSWORD_CHANGED);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id as string);
    sendResponse(res, 200, sanitizeUser(user), USER_MESSAGES.FETCHED);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { data, total } = await this.userService.getAllUsers(req.query);
    const sanitizedData = data.map((u) => sanitizeUser(u));
    const meta = getPaginationMeta(
      req.query.page as string,
      req.query.limit as string,
      total
    );
    sendResponse(res, 200, sanitizedData, USER_MESSAGES.LISTED, meta);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.adminUpdateUser(req.params.id as string, req.body);
    sendResponse(res, 200, sanitizeUser(user), USER_MESSAGES.UPDATED);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.deleteUser(req.params.id as string);
    sendResponse(res, 200, sanitizeUser(user), USER_MESSAGES.DELETED);
  });
}
