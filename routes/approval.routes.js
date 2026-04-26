import express from 'express';
import { getPending, getAll, approve, reject } from '../controller/approval.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { rejectSchema } from '../utils/validators.js';
import { approvalLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All approval routes — principal only
router.use(protect, authorizeRoles('principal'));
router.use(approvalLimiter);

// GET /api/approval/pending
router.get('/pending', getPending);

// GET /api/approval/all?status=&subject=&teacherId=&page=&limit=
router.get('/all', getAll);

// PATCH /api/approval/:id/approve
router.patch('/:id/approve', approve);

// PATCH /api/approval/:id/reject
router.patch('/:id/reject', validate(rejectSchema), reject);

export default router;