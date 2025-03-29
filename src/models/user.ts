import mongoose, { Schema, Document } from 'mongoose';
import { PasswordHelper } from '../helpers/password_helper';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'User';
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  refreshToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'User'], default: 'User' },
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await PasswordHelper.hashPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return PasswordHelper.comparePasswords(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('user', UserSchema);
