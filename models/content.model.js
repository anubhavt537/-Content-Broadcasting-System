import { pool } from '../config/db.config.js';

export const ContentModel = {
  async create({ title, description, subject, fileUrl, fileType, fileSize, uploadedBy, startTime, endTime }) {
    const { rows } = await pool.query(
      `INSERT INTO content
        (title, description, subject, file_url, file_type, file_size, uploaded_by, start_time, end_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [title, description, subject, fileUrl, fileType, fileSize, uploadedBy, startTime || null, endTime || null]
    );
    return rows[0];
  },

  async findByTeacher(teacherId) {
    const { rows } = await pool.query(
      `SELECT
         c.id, c.title, c.subject, c.description,
         c.file_url, c.file_type, c.file_size,
         c.status, c.rejection_reason,
         c.start_time, c.end_time,
         c.created_at,
         u.name AS approved_by_name
       FROM content c
       LEFT JOIN users u ON u.id = c.approved_by
       WHERE c.uploaded_by = $1
       ORDER BY c.created_at DESC`,
      [teacherId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM content WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findApprovedByTeacher(teacherId) {
    const { rows } = await pool.query(
      `SELECT * FROM content
       WHERE uploaded_by = $1
         AND status = 'approved'
       ORDER BY created_at DESC`,
      [teacherId]
    );
    return rows;
  },




async findPending() {
  const { rows } = await pool.query(
    `SELECT
       c.id, c.title, c.subject, c.description,
       c.file_url, c.file_type, c.file_size,
       c.status, c.start_time, c.end_time,
       c.created_at,
       u.name AS uploaded_by_name,
       u.email AS uploaded_by_email
     FROM content c
     JOIN users u ON u.id = c.uploaded_by
     WHERE c.status = 'pending'
     ORDER BY c.created_at ASC`
  );
  return rows;
},

async findAll({ status, subject, teacherId, page, limit }) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (status) { conditions.push(`c.status = $${idx++}`); values.push(status); }
  if (subject) { conditions.push(`c.subject = $${idx++}`); values.push(subject.toLowerCase()); }
  if (teacherId) { conditions.push(`c.uploaded_by = $${idx++}`); values.push(teacherId); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT
       c.id, c.title, c.subject, c.description,
       c.file_url, c.file_type, c.file_size,
       c.status, c.rejection_reason,
       c.start_time, c.end_time,
       c.created_at, c.approved_at,
       t.name AS uploaded_by_name,
       t.email AS uploaded_by_email,
       p.name AS approved_by_name
     FROM content c
     JOIN users t ON t.id = c.uploaded_by
     LEFT JOIN users p ON p.id = c.approved_by
     ${where}
     ORDER BY c.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) FROM content c ${where}`,
    values
  );

  return {
    data: rows,
    total: parseInt(countRows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countRows[0].count / limit),
  };
},

async approve(id, principalId) {
  const { rows } = await pool.query(
    `UPDATE content
     SET status = 'approved',
         approved_by = $1,
         approved_at = NOW()
     WHERE id = $2 AND status = 'pending'
     RETURNING *`,
    [principalId, id]
  );
  return rows[0] || null;
},

async reject(id, principalId, rejectionReason) {
  const { rows } = await pool.query(
    `UPDATE content
     SET status = 'rejected',
         rejection_reason = $1,
         approved_by = $2,
         approved_at = NOW()
     WHERE id = $3 AND status = 'pending'
     RETURNING *`,
    [rejectionReason, principalId, id]
  );
  return rows[0] || null;
},

// add this to your existing ContentModel object

async findApprovedAndScheduledByTeacher(teacherId) {
  const { rows } = await pool.query(
    `SELECT
       c.id, c.title, c.subject, c.description,
       c.file_url, c.file_type, c.file_size,
       c.start_time, c.end_time,
       cs.duration, cs.rotation_order,
       cs.slot_id
     FROM content c
     JOIN content_schedule cs ON cs.content_id = c.id
     JOIN content_slots sl ON sl.id = cs.slot_id
     WHERE c.uploaded_by = $1
       AND c.status = 'approved'
       AND c.start_time IS NOT NULL
       AND c.end_time IS NOT NULL
       AND c.start_time <= NOW()
       AND c.end_time >= NOW()
     ORDER BY c.subject ASC, cs.rotation_order ASC`,
    [teacherId]
  );
  return rows;
},
};