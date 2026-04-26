import { AppError } from '../utils/AppError.js';

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('Access denied: insufficient permissions', 403)
    );
  }
  next();
};