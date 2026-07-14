import { Router } from 'express';
import { UploadController } from './upload.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { upload } from '../../utils/upload';
import { validate } from '../../middleware/validation.middleware';
import { deleteUploadSchema, replaceUploadSchema } from './upload.validation';

const router = Router();
const controller = new UploadController();

router.post(
  '/single',
  authMiddleware as any,
  upload.single('file'),
  controller.uploadSingle
);

router.post(
  '/multiple',
  authMiddleware as any,
  upload.array('files', 10),
  controller.uploadMultiple
);

router.post(
  '/delete',
  authMiddleware as any,
  validate(deleteUploadSchema),
  controller.deleteFile
);

router.post(
  '/replace',
  authMiddleware as any,
  upload.single('file'),
  validate(replaceUploadSchema),
  controller.replaceFile
);

export default router;
