import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import googleAuthService from '../services/googleAuthService';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, referredBy } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const referralCode = Math.random().toString(36).substring(2, 10);

  try {
    const user = await User.create({ email, password: hashedPassword, name, referralCode, referredBy });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: "Registration failed", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password || '');
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
  res.json({ token, user });
};

// Google OAuth Routes
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const authUrl = googleAuthService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate Google Auth URL', error });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    const { user, token } = await googleAuthService.handleGoogleCallback(code);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Google authentication failed', error });
  }
};

export const verifyGoogleToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const { user, jwtToken } = await googleAuthService.verifyGoogleToken(token);
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(500).json({ message: 'Google token verification failed', error });
  }
};