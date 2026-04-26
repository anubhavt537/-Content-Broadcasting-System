import { ContentModel } from '../models/content.model.js';
import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';

export const SchedulingService = {

  async getActiveContent(teacherId) {

    // 1. Validate teacher exists and is actually a teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') return null;

    // 2. Fetch all approved + currently time-windowed content with schedule
    const rows = await ContentModel.findApprovedAndScheduledByTeacher(teacherId);

    // Edge case 1: no approved content at all
    // Edge case 2: approved but none within active time window
    if (!rows.length) return null;

    // 3. Group content by subject — each subject rotates independently
    const bySubject = rows.reduce((acc, row) => {
      const key = row.subject;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    // 4. For each subject determine which item is currently active
    const activeItems = [];

    const now = new Date();

    // Fixed epoch reference point for rotation calculation
    // Using Unix epoch so rotation is deterministic and consistent
    // across server restarts — no state needed
    const EPOCH_REF = new Date('2024-01-01T00:00:00.000Z');
    const elapsedSeconds = Math.floor((now - EPOCH_REF) / 1000);

    for (const [subject, items] of Object.entries(bySubject)) {

      // Sum of all durations for this subject in seconds
      const cycleTotalSeconds = items.reduce(
        (sum, item) => sum + item.duration * 60,
        0
      );

      // Where are we in the current rotation cycle
      const positionInCycle = elapsedSeconds % cycleTotalSeconds;

      // Walk items in rotation_order and find which one is active
      let accumulated = 0;
      let activeItem = null;

      for (const item of items) {
        accumulated += item.duration * 60;
        if (positionInCycle < accumulated) {
          activeItem = item;
          break;
        }
      }

      if (activeItem) {
        // Calculate how many seconds remain for this item in current slot
        const slotStart = accumulated - activeItem.duration * 60;
        const secondsIntoSlot = positionInCycle - slotStart;
        const secondsRemaining = activeItem.duration * 60 - secondsIntoSlot;

        activeItems.push({
          id: activeItem.id,
          title: activeItem.title,
          subject: activeItem.subject,
          description: activeItem.description,
          file_url: activeItem.file_url,
          file_type: activeItem.file_type,
          file_size: activeItem.file_size,
          rotation_order: activeItem.rotation_order,
          slot_duration_minutes: activeItem.duration,
          seconds_remaining_in_slot: secondsRemaining,
          active_until: new Date(now.getTime() + secondsRemaining * 1000).toISOString(),
          start_time: activeItem.start_time,
          end_time: activeItem.end_time,
        });
      }
    }

    // Edge case: subjects existed but none resolved to an active item
    if (!activeItems.length) return null;

    return activeItems;
  },

  // Utility: get full rotation preview for a subject (for debugging/admin)
  async getRotationPreview(teacherId, subject) {
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher')
      throw new AppError('Teacher not found', 404);

    const rows = await ContentModel.findApprovedAndScheduledByTeacher(teacherId);
    const subjectItems = rows.filter(r => r.subject === subject.toLowerCase());

    if (!subjectItems.length) return [];

    const EPOCH_REF = new Date('2024-01-01T00:00:00.000Z');
    const now = new Date();
    const elapsedSeconds = Math.floor((now - EPOCH_REF) / 1000);
    const cycleTotalSeconds = subjectItems.reduce((s, i) => s + i.duration * 60, 0);
    const positionInCycle = elapsedSeconds % cycleTotalSeconds;

    let accumulated = 0;
    return subjectItems.map(item => {
      const slotStart = accumulated;
      accumulated += item.duration * 60;
      const isActive = positionInCycle >= slotStart && positionInCycle < accumulated;
      return {
        rotation_order: item.rotation_order,
        title: item.title,
        duration_minutes: item.duration,
        slot_start_seconds: slotStart,
        slot_end_seconds: accumulated,
        is_active: isActive,
      };
    });
  },
};