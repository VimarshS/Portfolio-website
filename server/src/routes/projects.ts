import { Router } from 'express';
import { Project } from '../models/Project';

const router = Router();

// GET /api/projects -> all projects, in the saved order
router.get('/', async (_req, res) => {
  try {
    const docs = await Project.find()
      .sort({ order: 1 })
      .select('-_id -__v -createdAt -updatedAt')
      .lean();

    // Send "slug" back as "id" so it matches the frontend Project type
    const projects = docs.map(({ slug, order, ...rest }) => ({
      id: slug,
      ...rest,
    }));

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ success: false, message: 'Could not load projects.' });
  }
});

export default router;