import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { Role } from '@prisma/client';
import {
  updateProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema,
  getUserByIdSchema,
} from './user.validation';

const router = Router();
const controller = new UserController();

/**
 * @openapi
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         name:
 *           type: string
 *           nullable: true
 *         role:
 *           type: string
 *           enum: [USER, MANAGER, ADMIN, SUPER_ADMIN]
 *         isVerified:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UpdateProfileInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *     AdminUpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, MANAGER, ADMIN, SUPER_ADMIN]
 *         isVerified:
 *           type: boolean
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Retrieve current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 */
router.get('/me', authMiddleware as any, controller.getProfile);

/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 */
router.patch(
  '/me',
  authMiddleware as any,
  validate(updateProfileSchema),
  controller.updateProfile
);

/**
 * @openapi
 * /users/change-password:
 *   put:
 *     summary: Change current user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put(
  '/change-password',
  authMiddleware as any,
  validate(changePasswordSchema),
  controller.changePassword
);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users (Admin/Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, MANAGER, ADMIN, SUPER_ADMIN]
 *         description: Filter by role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query matching name or email
 *     responses:
 *       200:
 *         description: Users listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 */
router.get(
  '/',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  controller.getAll
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin/Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 */
router.get(
  '/:id',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER) as any,
  validate(getUserByIdSchema),
  controller.getById
);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Administrative update of a user record (Admin/Super Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateUserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 */
router.patch(
  '/:id',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN, Role.ADMIN) as any,
  validate(adminUpdateUserSchema),
  controller.update
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user record (Super Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete(
  '/:id',
  authMiddleware as any,
  authorize(Role.SUPER_ADMIN) as any,
  validate(getUserByIdSchema),
  controller.delete
);

export default router;
