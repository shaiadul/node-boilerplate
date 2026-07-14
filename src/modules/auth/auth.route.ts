import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validation.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.validation';

const router = Router();
const controller = new AuthController();

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           description: Must contain min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
 *         name:
 *           type: string
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *     ResetPasswordInput:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *         newPassword:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *         accessToken:
 *           type: string
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Registered successfully. Please verify your email.
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @openapi
 * /auth/verify-email:
 *   get:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to email
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.get('/verify-email', validate(verifyEmailSchema), controller.verifyEmail);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in user credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=abc; Path=/; HttpOnly; Secure
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
 *                   $ref: '#/components/schemas/LoginResponse'
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out current user session
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', controller.logout);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT Access Token using HTTP-only Refresh cookie
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
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
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 */
router.post('/refresh', controller.refresh);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset link email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset link sent to your email
 */
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password has been reset successfully
 */
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);

export default router;
