import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token', 401));
  }
};