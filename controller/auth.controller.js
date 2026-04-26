import { AuthService } from '../service/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';

export const register = asyncHandler(async (req, res) => {
  const user = await AuthService.register(req.body);
  return successResponse(res, user, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body);
  return successResponse(res, result, 'Login successful');
});