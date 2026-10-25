import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// To JSON transform for safe API output
UserSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
