import { Schema, model } from 'mongoose';

const counterSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export const Counter = model('Counter', counterSchema);