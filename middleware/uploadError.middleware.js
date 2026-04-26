import multer from 'multer';
import { AppError } from '../utils/AppError.js';

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File size exceeds 10MB limit', 422));
    }
    return next(new AppError(`Upload error: ${err.message}`, 422));
  }
  next(err);
};