import { SchedulingService } from '../service/scheduling.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';

// GET /content/live/:teacherId
export const getLiveContent = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const activeContent = await SchedulingService.getActiveContent(teacherId);

  // All edge cases return same shape — empty with message, never an error
  if (!activeContent) {
    return successResponse(res, [], 'No content available');
  }

  return successResponse(res, activeContent, 'Live content fetched successfully');
});

// GET /content/live/:teacherId/preview?subject=maths
// Bonus: shows full rotation order for a subject
export const getRotationPreview = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const { subject } = req.query;

  if (!subject) {
    return successResponse(res, [], 'Subject query param required');
  }

  const preview = await SchedulingService.getRotationPreview(teacherId, subject);
  return successResponse(res, preview, 'Rotation preview fetched');
});