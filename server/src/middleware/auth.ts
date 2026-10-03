import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Put this before any route that only the admin may use
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not logged in.' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is missing');

    jwt.verify(token, secret, { algorithms: ['HS256'] });
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: 'Session expired. Please log in again.' });
  }
}