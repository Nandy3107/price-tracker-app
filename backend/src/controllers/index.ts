// Re-export all controllers for easy importing
export * from './wishlistController';
export * from './priceTrackingController';
export * from './notificationController';
export * from './priceComparisonController';
export * from './affiliateController';
export * from './referralController';
export * from './authController';
export * from './chatbotController';
export * from './importController';

// Simple health check endpoint
import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Price Tracker API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
};
