import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth';
import mongoose from 'mongoose';
import { Message } from '../models/Message';
import { Counter } from '../models/Counter';

const router = Router();

// Max 5 login tries per 15 minutes from one IP (stops password guessing)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and password are required.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.JWT_SECRET;

  if (!adminEmail || !adminHash || !secret) {
    console.error('Admin login is missing ADMIN_EMAIL, ADMIN_PASSWORD_HASH or JWT_SECRET');
    return res
      .status(500)
      .json({ success: false, message: 'Admin login is not configured.' });
  }

  try {
    const { email, password } = parsed.data;

    // Always check the password, so the response time does not reveal
    // whether the email was correct
    const passwordOk = await bcrypt.compare(password, adminHash);
    const emailOk = email.toLowerCase() === adminEmail.toLowerCase();

    if (!emailOk || !passwordOk) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '8h' });
    return res.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/admin/me -> proves your token is valid (we use it in the React page later)
router.get('/me', requireAdmin, (_req, res) => {
  res.json({ success: true, role: 'admin' });
});

// GET /api/admin/stats -> numbers for the dashboard
router.get('/stats', requireAdmin, async (_req, res) => {
  try {
    const [totalMessages, unreadMessages, resumeCounter] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Counter.findOne({ key: 'resume_downloads' }).lean(),
    ]);

    res.json({
      success: true,
      stats: {
        totalMessages,
        unreadMessages,
        resumeDownloads: resumeCounter?.count ?? 0,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Could not load stats.' });
  }
});

// GET /api/admin/messages -> newest first (max 200)
router.get('/messages', requireAdmin, async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Messages list error:', error);
    res.status(500).json({ success: false, message: 'Could not load messages.' });
  }
});

// PATCH /api/admin/messages/:id/read -> mark read or unread
const readSchema = z.object({ isRead: z.boolean().default(true) });

router.patch('/messages/:id/read', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid message id.' });
  }

  const parsed = readSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'isRead must be true or false.' });
  }

  try {
    const updated = await Message.findByIdAndUpdate(
      id,
      { isRead: parsed.data.isRead },
      { returnDocument: 'after' }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.json({ success: true, message: updated });
  } catch (error) {
    console.error('Mark read error:', error);
    return res.status(500).json({ success: false, message: 'Could not update message.' });
  }
});

// DELETE /api/admin/messages/:id -> permanent delete
router.delete('/messages/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid message id.' });
  }

  try {
    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({ success: false, message: 'Could not delete message.' });
  }
});

export default router;