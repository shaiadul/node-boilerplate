import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { Role } from '@prisma/client';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdParamsSchema,
} from './category.validation';

const router = Router();
const controller = new CategoryController();

router.post(
  '/',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  validate(createCategorySchema),
  controller.create
);

router.get('/', controller.getAll);

router.get(
  '/id/:id',
  validate(getCategoryByIdParamsSchema),
  controller.getById
);

router.get('/slug/:slug', controller.getBySlug);

router.put(
  '/id/:id',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  validate(updateCategorySchema),
  controller.update
);

router.delete(
  '/id/:id',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN) as any,
  validate(getCategoryByIdParamsSchema),
  controller.delete
);

export default router;
