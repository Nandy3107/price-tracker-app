import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description?: string;
  url: string;
  current_price: number;
  original_price?: number;
  currency: string;
  availability: string;
  category: string;
  brand?: string;
  image_url?: string;
  platform: string; // Amazon, Flipkart, etc.
  isActive: boolean;
  lastChecked: Date;
  priceHistory: Array<{
    price: number;
    date: Date;
    source: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  current_price: { type: Number, required: true },
  original_price: { type: Number },
  currency: { type: String, default: 'INR' },
  availability: { type: String, default: 'In Stock' },
  category: { type: String, required: true },
  brand: { type: String },
  image_url: { type: String },
  platform: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastChecked: { type: Date, default: Date.now },
  priceHistory: [{
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    source: { type: String, required: true }
  }]
}, {
  timestamps: true
});

// Index for better query performance
ProductSchema.index({ url: 1 });
ProductSchema.index({ platform: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ lastChecked: 1 });

export const Product = model<IProduct>('Product', ProductSchema);
export default Product;
