import { Request, Response } from 'express';
import { UploadService } from './upload.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/response';
import { UPLOAD_MESSAGES } from './upload.constants';
import { ApiError } from '../../utils/ApiError';

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  uploadSingle = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, UPLOAD_MESSAGES.NO_FILE);
    }
    const result = await this.uploadService.uploadSingle(req.file);
    sendResponse(res, 201, result, UPLOAD_MESSAGES.SINGLE_SUCCESS);
  });

  uploadMultiple = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new ApiError(400, UPLOAD_MESSAGES.NO_FILE);
    }
    const result = await this.uploadService.uploadMultiple(files);
    sendResponse(res, 201, result, UPLOAD_MESSAGES.MULTIPLE_SUCCESS);
  });

  deleteFile = asyncHandler(async (req: Request, res: Response) => {
    const { publicId } = req.body;
    await this.uploadService.deleteFile(publicId);
    sendResponse(res, 200, null, UPLOAD_MESSAGES.DELETE_SUCCESS);
  });

  replaceFile = asyncHandler(async (req: Request, res: Response) => {
    const { publicId } = req.body;
    if (!req.file) {
      throw new ApiError(400, UPLOAD_MESSAGES.NO_FILE);
    }
    const result = await this.uploadService.replaceFile(publicId, req.file);
    sendResponse(res, 200, result, UPLOAD_MESSAGES.REPLACE_SUCCESS);
  });
}
