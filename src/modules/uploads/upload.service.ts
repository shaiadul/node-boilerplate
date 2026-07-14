import cloudinary from '../../config/cloudinary';
import { IUploadResponse } from './upload.interface';
import { ApiError } from '../../utils/ApiError';
import { CLOUDINARY_FOLDER } from './upload.constants';
import { logger } from '../../config/logger';

export class UploadService {
  private async uploadStream(fileBuffer: Buffer, fileName: string): Promise<IUploadResponse> {
    return new Promise((resolve, reject) => {
      const cleanedFileName = fileName
        .replace(/\.[^/.]+$/, '') // remove extension
        .replace(/[^a-zA-Z0-9]/g, '_'); // sanitize name

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          public_id: `${cleanedFileName}_${Date.now()}`,
          resource_type: 'auto',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            logger.error('Cloudinary stream upload error:', error);
            return reject(new ApiError(500, 'Cloudinary image upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });
        }
      );
      stream.end(fileBuffer);
    });
  }

  async uploadSingle(file: Express.Multer.File): Promise<IUploadResponse> {
    if (!file) {
      throw new ApiError(400, 'No file provided for upload');
    }
    return this.uploadStream(file.buffer, file.originalname);
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<IUploadResponse[]> {
    if (!files || files.length === 0) {
      throw new ApiError(400, 'No files provided for upload');
    }
    const promises = files.map((file) => this.uploadStream(file.buffer, file.originalname));
    return Promise.all(promises);
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        logger.error(`Cloudinary deletion failed for public ID ${publicId}:`, result);
        throw new ApiError(400, `Cloudinary delete operation failed: ${result.result}`);
      }
    } catch (error) {
      logger.error('Cloudinary deletion exception:', error);
      throw new ApiError(500, 'Cloudinary delete operation failed');
    }
  }

  async replaceFile(oldPublicId: string, newFile: Express.Multer.File): Promise<IUploadResponse> {
    await this.deleteFile(oldPublicId).catch((err) => {
      logger.warn(`Failed to delete old asset ${oldPublicId} during replace: ${err.message}`);
    });
    return this.uploadSingle(newFile);
  }
}
