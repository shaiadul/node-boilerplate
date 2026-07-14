import { Router } from 'express';
import { OrderController } from './order.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { Role } from '@prisma/client';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrderByIdSchema,
} from './order.validation';

const router = Router();
const controller = new OrderController();

router.post(
  '/',
  authMiddleware as any,
  validate(createOrderSchema),
  controller.create
);

router.get(
  '/my',
  authMiddleware as any,
  controller.getMyOrders
);

router.get(
  '/',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  controller.getAll
);

router.get(
  '/:id',
  authMiddleware as any,
  validate(getOrderByIdSchema),
  controller.getById
);

router.patch(
  '/:id/status',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  validate(updateOrderStatusSchema),
  controller.updateStatus
);

export default router;
