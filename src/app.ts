import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import { swaggerSpec } from './docs/swagger';

import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/users/user.route';
import categoryRoutes from './modules/categories/category.route';
import productRoutes from './modules/products/product.route';
import orderRoutes from './modules/orders/order.route';
import uploadRoutes from './modules/uploads/upload.route';

import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Helmet for Secure Headers
app.use(helmet());

// CORS configuration matching client origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again in 15 minutes.',
  },
});

if (env.NODE_ENV !== 'test') {
  app.use('/api/', limiter);
}

// Parsing request bodies, cookies and compressing responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Route morgan outputs to winston HTTP stream
const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};
app.use(
  morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms', {
    stream: morganStream,
  })
);

// Simple app Health Check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: Date.now(),
      env: env.NODE_ENV,
    },
  });
});

// Auto-generated Swagger Documentation path
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Versioned APIs mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// Fallback unmatched 404 route middleware
app.use(notFoundMiddleware);

// Global operational errors logger and response parser middleware
app.use(errorMiddleware);

export default app;
