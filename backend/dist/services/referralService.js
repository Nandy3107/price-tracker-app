"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = exports.processReferralCashback = void 0;
const processReferralCashback = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Stub: Replace with real cashback logic
    const cashbackAmount = (data.purchaseAmount * data.cashbackPercentage) / 100;
    console.log(`Processing ₹${cashbackAmount} cashback for referrer ${data.referrerId}`);
    return cashbackAmount;
});
exports.processReferralCashback = processReferralCashback;
const generateReferralCode = (userId) => {
    // Generate unique referral code
    return `REF${userId.slice(-6).toUpperCase()}${Date.now().toString().slice(-4)}`;
};
exports.generateReferralCode = generateReferralCode;
