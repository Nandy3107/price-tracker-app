"use strict";
// import { Request, Response } from 'express';
// import { WishlistService } from '../services/wishlistService';
// import { PriceTrackingService } from '../services/priceTrackingService';
// import { NotificationService } from '../services/notificationService';
// import { ReferralService } from '../services/referralService';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReferral = exports.comparePrices = exports.generateAffiliateLink = exports.notifyUser = exports.trackPrice = exports.deleteWishListItem = exports.editWishListItem = exports.addWishListItem = exports.getWishListItems = void 0;
const index_1 = __importDefault(require("../models/index"));
// Get all wishlist items for a user
const getWishListItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const wishlist = yield index_1.default.findOne({ userId });
        res.json(wishlist || { items: [] });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});
exports.getWishListItems = getWishListItems;
// Add an item to the wishlist
const addWishListItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, item } = req.body;
        let wishlist = yield index_1.default.findOne({ userId });
        if (!wishlist) {
            wishlist = new index_1.default({ userId, items: [item] });
        }
        else {
            wishlist.items.push(item);
        }
        yield wishlist.save();
        res.status(201).json(wishlist);
    }
    catch (err) {
        res.status(500).json({ message: 'Error adding item to wishlist' });
    }
});
exports.addWishListItem = addWishListItem;
// Edit a wishlist item
const editWishListItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, itemIndex, item } = req.body;
        const wishlist = yield index_1.default.findOne({ userId });
        if (!wishlist)
            return res.status(404).json({ message: 'Wishlist not found' });
        wishlist.items[itemIndex] = item;
        yield wishlist.save();
        res.json(wishlist);
    }
    catch (err) {
        res.status(500).json({ message: 'Error editing item' });
    }
});
exports.editWishListItem = editWishListItem;
// Delete a wishlist item
const deleteWishListItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, itemIndex } = req.body;
        const wishlist = yield index_1.default.findOne({ userId });
        if (!wishlist)
            return res.status(404).json({ message: 'Wishlist not found' });
        wishlist.items.splice(itemIndex, 1);
        yield wishlist.save();
        res.json(wishlist);
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting item' });
    }
});
exports.deleteWishListItem = deleteWishListItem;
// Placeholders for other features
const trackPrice = (req, res) => {
    res.json({ message: 'trackPrice placeholder' });
};
exports.trackPrice = trackPrice;
const notifyUser = (req, res) => {
    res.json({ message: 'notifyUser placeholder' });
};
exports.notifyUser = notifyUser;
const generateAffiliateLink = (req, res) => {
    res.json({ message: 'generateAffiliateLink placeholder' });
};
exports.generateAffiliateLink = generateAffiliateLink;
const comparePrices = (req, res) => {
    res.json({ message: 'comparePrices placeholder' });
};
exports.comparePrices = comparePrices;
const handleReferral = (req, res) => {
    res.json({ message: 'handleReferral placeholder' });
};
exports.handleReferral = handleReferral;
