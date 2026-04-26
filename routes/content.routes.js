import express from 'express';
import { uploadContent, getMyContent, getMySchedule, getContentById } from '../controller/content.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uploadSchema } from '../utils/validators.js';
import { upload } from '../config/multer.js';
import { handleUploadError } from '../middleware/uploadError.middleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All content routes — teacher only
router.use(protect, authorizeRoles('teacher'));

// POST /api/content/upload
router.post(
  '/upload',
  uploadLimiter,               // rate limit uploads
  upload.single('file'),       // multer runs first
  handleUploadError,           // catches multer-specific errors
  validate(uploadSchema),      // then validates body fields
  uploadContent
);

// GET /api/content/my-content
router.get('/my-content', getMyContent);

// GET /api/content/my-schedule
router.get('/my-schedule', getMySchedule);

// GET /api/content/:id
router.get('/:id', getContentById);

export default router;