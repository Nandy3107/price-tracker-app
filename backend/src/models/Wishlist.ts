import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    url: string;
    image_url: string;
    current_price: number;
    platform: string;
    description?: string;
  };
  target_price?: number;
  added_at: Date;
  category?: string;
  price_history: Array<{
    price: number;
    recorded_at: Date;
  }>;
}

export interface IWishlist extends Document {
  userId: string;
  items: IWishlistItem[];
  created_at: Date;
  updated_at: Date;
}

const WishlistItemSchema = new Schema({
  id: { type: String, required: true },
  product: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    image_url: { type: String, required: true },
    current_price: { type: Number, required: true },
    platform: { type: String, required: true },
    description: { type: String }
  },
  target_price: { type: Number },
  added_at: { type: Date, default: Date.now },
  category: { type: String },
  price_history: [{
    price: { type: Number, required: true },
    recorded_at: { type: Date, default: Date.now }
  }]
});

const WishlistSchema = new Schema({
  userId: { type: String, required: true },
  items: [WishlistItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field before saving
WishlistSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default (mongoose.models.Wishlist as mongoose.Model<IWishlist>) || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
