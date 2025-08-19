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
exports.processCashback = exports.getReferralCode = void 0;
const referralService_1 = require("../services/referralService");
const getReferralCode = (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const referralCode = (0, referralService_1.generateReferralCode)(userId);
    res.json({ referralCode });
};
exports.getReferralCode = getReferralCode;
const processCashback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { referrerId, refereeId, purchaseAmount, cashbackPercentage = 5 } = req.body;
    if (!referrerId || !refereeId || !purchaseAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const cashbackAmount = yield (0, referralService_1.processReferralCashback)({
        referrerId,
        refereeId,
        purchaseAmount,
        cashbackPercentage
    });
    res.json({ cashbackAmount, message: 'Cashback processed successfully' });
});
exports.processCashback = processCashback;
