import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Project } from '../models/Project';
import { PROJECTS } from '../../../src/data/portfolioData';

dotenv.config();

async function seed() {
  await connectDB();

  for (const [index, project] of PROJECTS.entries()) {
    const { id, ...fields } = project;

    // upsert = update if it exists, create if it does not
    await Project.findOneAndUpdate(
      { slug: id },
      { ...fields, slug: id, order: index },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    console.log(`Saved: ${project.title}`);
  }

  console.log(`Done. ${PROJECTS.length} projects are in the database.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});