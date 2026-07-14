import { Router } from 'express';
import { ProductController } from './product.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { Role } from '@prisma/client';
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdParamsSchema,
} from './product.validation';

const router = Router();
const controller = new ProductController();

router.post(
  '/',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  validate(createProductSchema),
  controller.create
);

router.get('/', controller.getAll);

router.get(
  '/id/:id',
  validate(getProductByIdParamsSchema),
  controller.getById
);

router.get('/slug/:slug', controller.getBySlug);

router.put(
  '/id/:id',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  validate(updateProductSchema),
  controller.update
);

router.delete(
  '/id/:id',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN) as any,
  validate(getProductByIdParamsSchema),
  controller.delete
);

export default router;
