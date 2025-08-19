// Referral and Cashback Service
export interface ReferralData {
    referrerId: string;
    refereeId: string;
    purchaseAmount: number;
    cashbackPercentage: number;
}

export const processReferralCashback = async (data: ReferralData): Promise<number> => {
    // Stub: Replace with real cashback logic
    const cashbackAmount = (data.purchaseAmount * data.cashbackPercentage) / 100;
    console.log(`Processing ₹${cashbackAmount} cashback for referrer ${data.referrerId}`);
    return cashbackAmount;
};

export const generateReferralCode = (userId: string): string => {
    // Generate unique referral code
    return `REF${userId.slice(-6).toUpperCase()}${Date.now().toString().slice(-4)}`;
};
