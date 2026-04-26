import { ContentService } from '../service/content.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';

// POST /api/content/upload
export const uploadContent = asyncHandler(async (req, res) => {
  const result = await ContentService.upload({
    body: req.body,
    file: req.file,
    userId: req.user.id,
  });
  return successResponse(res, result, 'Content uploaded successfully', 201);
});

// GET /api/content/my-content
export const getMyContent = asyncHandler(async (req, res) => {
  const content = await ContentService.getMyContent(req.user.id);
  return successResponse(res, content, 'Content fetched successfully');
});

// GET /api/content/my-schedule
export const getMySchedule = asyncHandler(async (req, res) => {
  const schedule = await ContentService.getMySchedule(req.user.id);
  return successResponse(res, schedule, 'Schedule fetched successfully');
});

// GET /api/content/:id
export const getContentById = asyncHandler(async (req, res) => {
  const content = await ContentService.getById(req.params.id, req.user.id);
  return successResponse(res, content, 'Content fetched successfully');
});