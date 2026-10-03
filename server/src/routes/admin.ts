import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth';

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

export default router;