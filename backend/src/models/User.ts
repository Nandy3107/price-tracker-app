import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  referralCode: string;
  referredBy?: string;
  googleId?: string;
  profilePicture?: string;
  authProvider?: 'local' | 'google';
  preferences: {
    whatsapp_number?: string;
    preferred_platforms: string[];
    price_alert_threshold: number;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Made optional for Google OAuth users
  name: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String },
  googleId: { type: String, sparse: true, unique: true },
  profilePicture: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  preferences: {
    whatsapp_number: { type: String },
    preferred_platforms: { type: [String], default: ['Amazon', 'Flipkart', 'Myntra'] },
    price_alert_threshold: { type: Number, default: 10 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);