import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { standardRateLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { isOpenAIConfigured } from './config/openai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. CORS
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 3. Body parsers & Request logging
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 4. Rate Limiting on API routes
app.use('/api', standardRateLimiter);

// 5. Mount API Routes
app.use('/api', apiRouter);

// Root greeting & status
app.get('/', (req, res) => {
  res.json({
    name: 'Qstream AI — Enterprise Microlearning Engine',
    version: '1.0.0',
    status: 'ACTIVE',
    documentation: '/api/health',
    supabaseConnected: isSupabaseConfigured,
    aiConfigured: isOpenAIConfigured
  });
});

// 6. 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Qstream AI REST API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Supabase status: ${isSupabaseConfigured ? 'CONNECTED (hataawyodibdnnjolvqc)' : 'LOCAL DATASET FALLBACK READY'}`);
  console.log(`🤖 OpenAI status: ${isOpenAIConfigured ? 'LIVE GENERATION ENABLED' : 'SMART QUESTION BANK & HEURISTIC TUTOR'}`);
  console.log('====================================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
