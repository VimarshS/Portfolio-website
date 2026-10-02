import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Counter } from '../models/Counter';

const router = Router();

// Max 20 counts per 15 minutes from one IP, so nobody can inflate the number
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests.' },
});

// POST /api/resume/download -> adds 1 to the download counter
router.post('/download', downloadLimiter, async (_req, res) => {
  try {
    await Counter.findOneAndUpdate(
      { key: 'resume_downloads' },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Resume counter error:', error);
    res.status(500).json({ success: false, message: 'Could not record download.' });
  }
});

export default router;