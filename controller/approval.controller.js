import { ApprovalService } from '../service/approval.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';

// GET /api/approval/pending
export const getPending = asyncHandler(async (req, res) => {
  const content = await ApprovalService.getPending();
  return successResponse(res, content, 'Pending content fetched');
});

// GET /api/approval/all
// Supports: ?status=approved&subject=maths&teacherId=uuid&page=1&limit=10
export const getAll = asyncHandler(async (req, res) => {
  const { status, subject, teacherId, page = 1, limit = 10 } = req.query;
  const result = await ApprovalService.getAll({ status, subject, teacherId, page, limit });
  return successResponse(res, result, 'All content fetched');
});

// PATCH /api/approval/:id/approve
export const approve = asyncHandler(async (req, res) => {
  const content = await ApprovalService.approve(req.params.id, req.user.id);
  return successResponse(res, content, 'Content approved successfully');
});

// PATCH /api/approval/:id/reject
export const reject = asyncHandler(async (req, res) => {
  const { rejection_reason } = req.body;
  const content = await ApprovalService.reject(req.params.id, req.user.id, rejection_reason);
  return successResponse(res, content, 'Content rejected successfully');
});