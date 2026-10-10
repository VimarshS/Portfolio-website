import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import contactRoutes from './routes/contact';
import projectRoutes from './routes/projects';
import resumeRoutes from './routes/resume';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
// Render puts a proxy in front of the server. Without this, every visitor
// looks like the same IP and the rate limits would block everyone together.
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

app.use(helmet());
// CLIENT_URL can hold several addresses, separated by commas
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10kb' }));

app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Portfolio server is running' });
});
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'portfolio-api' });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();