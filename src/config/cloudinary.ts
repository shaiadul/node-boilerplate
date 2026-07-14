import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';
import { logger } from './logger';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME || 'default_cloud_name',
  api_key: env.CLOUDINARY_KEY || 'default_api_key',
  api_secret: env.CLOUDINARY_SECRET || 'default_api_secret',
  secure: true,
});

logger.info('☁️ Cloudinary SDK configured successfully');

export default cloudinary;
