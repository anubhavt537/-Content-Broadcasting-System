import { pool } from '../config/db.config.js';
export const ScheduleModel = {
  async createSlot({ subject, teacherId }) {
    
    const { rows: existing } = await pool.query(
      `SELECT id FROM content_slots WHERE subject = $1 AND teacher_id = $2`,
      [subject, teacherId]
    );
    if (existing.length) return existing[0];

    const { rows } = await pool.query(
      `INSERT INTO content_slots (subject, teacher_id)
       VALUES ($1, $2) RETURNING *`,
      [subject, teacherId]
    );
    return rows[0];
  },

  async createSchedule({ contentId, slotId, duration }) {
    // Get next rotation_order for this slot
    const { rows: orderRows } = await pool.query(
      `SELECT COALESCE(MAX(rotation_order), -1) + 1 AS next_order
       FROM content_schedule WHERE slot_id = $1`,
      [slotId]
    );
    const rotationOrder = orderRows[0].next_order;

    const { rows } = await pool.query(
      `INSERT INTO content_schedule (content_id, slot_id, rotation_order, duration)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [contentId, slotId, rotationOrder, duration || 5]
    );
    return rows[0];
  },

  async getScheduleForTeacher(teacherId) {
    const { rows } = await pool.query(
      `SELECT
         c.id, c.title, c.subject, c.status,
         c.start_time, c.end_time,
         cs.duration, cs.rotation_order,
         sl.subject AS slot_subject
       FROM content c
       JOIN content_schedule cs ON cs.content_id = c.id
       JOIN content_slots sl ON sl.id = cs.slot_id
       WHERE sl.teacher_id = $1
       ORDER BY c.subject, cs.rotation_order ASC`,
      [teacherId]
    );
    return rows;
  },
};