import path from 'path';
import { ContentModel } from '../models/content.model.js';
import { ScheduleModel } from '../models/schedule.model.js';
import { AppError } from '../utils/AppError.js';

export const ContentService = {
  async upload({ body, file, userId }) {
    
    if (!file) throw new AppError('File is required', 422);

    const { title, description, subject, start_time, end_time, duration } = body;

    // Build file URL (relative path students/teachers can access)
    const fileUrl = `/uploads/${file.filename}`.replace(/\\/g, '/');
    const fileType = path.extname(file.originalname).replace('.', '').toLowerCase();
    const fileSize = file.size;

    // 1. Insert content row
    const content = await ContentModel.create({
      title,
      description: description || null,
      subject: subject.toLowerCase(),
      fileUrl,
      fileType,
      fileSize,
      uploadedBy: userId,
      startTime: start_time || null,
      endTime: end_time || null,
    });

    // 2. Create or get content slot for this subject+teacher
    const slot = await ScheduleModel.createSlot({
      subject: subject.toLowerCase(),
      teacherId: userId,
    });

    // 3. Add to rotation schedule
    const schedule = await ScheduleModel.createSchedule({
      contentId: content.id,
      slotId: slot.id,
      duration: duration ? parseInt(duration) : 5,
    });

    return { content, schedule };
  },

  async getMyContent(teacherId) {
    const content = await ContentModel.findByTeacher(teacherId);
    return content;
  },

  async getMySchedule(teacherId) {
    const schedule = await ScheduleModel.getScheduleForTeacher(teacherId);
    return schedule;
  },

  async getById(id, teacherId) {
    const content = await ContentModel.findById(id);
    if (!content) throw new AppError('Content not found', 404);
    if (content.uploaded_by !== teacherId)
      throw new AppError('Not authorized to view this content', 403);
    return content;
  },
};