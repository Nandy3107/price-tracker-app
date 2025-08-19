import { Request, Response } from 'express';
import { processReferralCashback, generateReferralCode } from '../services/referralService';

export const getReferralCode = (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const referralCode = generateReferralCode(userId);
    res.json({ referralCode });
};

export const processCashback = async (req: Request, res: Response) => {
    const { referrerId, refereeId, purchaseAmount, cashbackPercentage = 5 } = req.body;
    
    if (!referrerId || !refereeId || !purchaseAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const cashbackAmount = await processReferralCashback({
        referrerId,
        refereeId,
        purchaseAmount,
        cashbackPercentage
    });
    
    res.json({ cashbackAmount, message: 'Cashback processed successfully' });
};

// Enhanced referral system with rewards
export const handleReferral = async (req: Request, res: Response) => {
  try {
    const { referrerUserId, referredEmail, referralCode } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({
        success: false,
        message: 'Referral code is required'
      });
    }

    // Find referrer user
    const { User } = await import('../models/index');
    const referrer = await User.findOne({ referralCode });
    
    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    // Check if referred email already exists
    const existingUser = await User.findOne({ email: referredEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate reward points (simplified reward system)
    const referrerReward = 100; // Points for referrer
    const referredReward = 50;  // Welcome bonus for new user

    // In a real system, you would:
    // 1. Create the new user account
    // 2. Update referrer's reward points
    // 3. Send welcome emails
    // 4. Track referral analytics

    console.log(`🎉 Referral processed: ${referrer.name} referred ${referredEmail}`);
    console.log(`💰 Rewards: Referrer gets ${referrerReward} points, New user gets ${referredReward} points`);

    res.json({
      success: true,
      message: 'Referral processed successfully',
      data: {
        referrer: {
          name: referrer.name,
          email: referrer.email,
          rewardPoints: referrerReward
        },
        referred: {
          email: referredEmail,
          welcomeBonus: referredReward
        },
        referralCode,
        benefits: [
          'Referrer gets 100 reward points',
          'New user gets 50 welcome bonus points',
          'Both get early access to price alerts',
          'Exclusive deals and discounts'
        ],
        processedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Referral processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process referral',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
