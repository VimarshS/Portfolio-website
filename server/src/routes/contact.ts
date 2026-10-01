import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Message } from '../models/Message';
import { sendContactNotification } from '../services/mailer';

const router = Router();

// Max 5 messages per 15 minutes from one IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Please try again later.' },
});

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email'),
  category: z.string().trim().max(50).optional().default('General'),
  subject: z.string().trim().min(1, 'Subject is required').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
  website: z.string().optional(), // honeypot field, real users leave it empty
});

router.post('/', contactLimiter, async (req, res) => {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
  }

  const { website, ...data } = result.data;

  // Bots fill hidden fields. Pretend success, but save nothing.
  if (website) {
    return res.json({ success: true, message: 'Message sent successfully.' });
  }

    try {
    await Message.create(data);

    // The message is already saved. If the email fails, we only log it.
    try {
      await sendContactNotification(data);
    } catch (mailError) {
      console.error('Email notification failed:', mailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message was received.',
    });
  } catch (error) {
    console.error('Contact save error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please email directly.',
    });
  }
});

export default router;