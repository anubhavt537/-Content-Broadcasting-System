import express from 'express';
import { getLiveContent, getRotationPreview } from '../controller/public.controller.js';
import { publicLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Fully public — no auth, no role check
// Students hit this endpoint
router.use(publicLimiter);

// GET /content/live/:teacherId
router.get('/live/:teacherId', getLiveContent);

// GET /content/live/:teacherId/preview?subject=maths
router.get('/live/:teacherId/preview', getRotationPreview);

export default router;