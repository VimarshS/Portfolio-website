import { Schema, model } from 'mongoose';

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    tagline: { type: String, default: '' },
    summary: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    category: {
      type: String,
      required: true,
      enum: ['Full-Stack & AI', 'AI & Web', 'Real-Time & WebSockets'],
    },
    mockupType: {
      type: String,
      required: true,
      enum: ['interview', 'notes', 'chat'],
    },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    architecture: { type: String, default: '' },
    learnings: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Project = model('Project', projectSchema);