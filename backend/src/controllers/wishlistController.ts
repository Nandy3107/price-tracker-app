import { Request, Response } from 'express';
import { Wishlist } from '../models/index';

// Get all wishlist items for a user
export const getWishListItems = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const wishlist = await Wishlist.findOne({ userId });
    res.json(wishlist || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// Add an item to the wishlist
export const addWishListItem = async (req: Request, res: Response) => {
  try {
    const { userId, item } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [item] });
    } else {
      wishlist.items.push(item);
    }
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error adding item to wishlist' });
  }
};

// Edit a wishlist item
export const editWishListItem = async (req: Request, res: Response) => {
  try {
    const { userId, itemIndex, item } = req.body;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items[itemIndex] = item;
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error editing item' });
  }
};

// Delete a wishlist item
export const deleteWishListItem = async (req: Request, res: Response) => {
  try {
    const { userId, itemIndex } = req.body;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};
