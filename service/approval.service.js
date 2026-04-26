import { ContentModel } from '../models/content.model.js';
import { AppError } from '../utils/AppError.js';

export const ApprovalService = {
  async getPending() {
    const content = await ContentModel.findPending();
    return content;
  },

  async getAll({ status, subject, teacherId, page = 1, limit = 10 }) {
    // Validate status if provided
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 422);
    }

    return await ContentModel.findAll({ status, subject, teacherId, page: parseInt(page), limit: parseInt(limit) });
  },

  async approve(id, principalId) {
    // Check content exists first
    const content = await ContentModel.findById(id);
    if (!content) throw new AppError('Content not found', 404);

    // Only pending content can be approved
    if (content.status !== 'pending')
      throw new AppError(`Content is already ${content.status}`, 409);

    const updated = await ContentModel.approve(id, principalId);
    if (!updated) throw new AppError('Approval failed', 500);

    return updated;
  },

  async reject(id, principalId, rejectionReason) {
    // Check content exists first
    const content = await ContentModel.findById(id);
    if (!content) throw new AppError('Content not found', 404);

    // Only pending content can be rejected
    if (content.status !== 'pending')
      throw new AppError(`Content is already ${content.status}`, 409);

    const updated = await ContentModel.reject(id, principalId, rejectionReason);
    if (!updated) throw new AppError('Rejection failed', 500);

    return updated;
  },
};