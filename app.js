import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import approvalRoutes from './routes/approval.routes.js';
import publicRoutes from './routes/public.routes.js';
import { UPLOAD_DIR } from './config/multer.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);
// Routes
app.use('/api/auth', authRoutes);


// after authRoutes
app.use('/uploads', express.static('uploads'));   // serve uploaded files
app.use('/api/content', contentRoutes);


// after content routes
app.use('/api/approval', approvalRoutes);

// Public routes — no auth
app.use('/content', publicRoutes);



// Both multer and static now point to the exact same folder
app.use('/uploads', express.static(UPLOAD_DIR));


// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;