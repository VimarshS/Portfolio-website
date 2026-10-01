import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    category: { type: String, default: 'General', trim: true, maxlength: 50 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = model('Message', messageSchema);