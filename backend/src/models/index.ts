import mongoose, { Schema, Document } from 'mongoose';

// User Model
export interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  name: string;
  whatsapp_number?: string;
  preferences: {
    whatsapp_notifications: boolean;
    price_alert_threshold: number;
    preferred_platforms: string[];
  };
  referralCode: string;
  referredBy?: string;
  created_at: Date;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  whatsapp_number: { type: String },
  preferences: {
    whatsapp_notifications: { type: Boolean, default: false },
    price_alert_threshold: { type: Number, default: 10 },
    preferred_platforms: [{ type: String }]
  },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

// Export Wishlist model
export { default as Wishlist } from './Wishlist';