import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface GoogleUserInfo {
  googleId?: string;
  id?: string;
  email: string;
  name: string;
  picture?: string;
  profilePicture?: string;
}

class GoogleAuthService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'
    );
  }

  // Generate Google OAuth URL
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Handle Google OAuth callback
  async handleGoogleCallback(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const { data } = await oauth2.userinfo.get();

      if (!data.email || !data.name) {
        throw new Error('Incomplete user data from Google');
      }

      // Find or create user
      const user = await this.findOrCreateUser({
        googleId: data.id!,
        email: data.email,
        name: data.name,
        profilePicture: data.picture || undefined,
      });

      // Generate JWT token
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

      return { user, token: jwtToken };
    } catch (error) {
      console.error('Google callback error:', error);
      throw new Error('Failed to process Google authentication');
    }
  }

  // Verify Google token (for client-side authentication)
  async verifyGoogleToken(googleToken: string) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      // Find or create user
      const user = await this.findOrCreateUser({
        googleId: payload.sub,
        email: payload.email!,
        name: payload.name!,
        profilePicture: payload.picture || undefined,
      });

      // Generate JWT token
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

      return { user, jwtToken };
    } catch (error) {
      throw new Error('Failed to verify Google token');
    }
  }

  // Find or create user in database
  async findOrCreateUser(googleUser: GoogleUserInfo) {
    try {
      let user = await User.findOne({ email: googleUser.email });
      
      if (!user) {
        // Create new user with Google info
        const referralCode = Math.random().toString(36).substring(2, 10);
        user = await User.create({
          email: googleUser.email,
          name: googleUser.name,
          referralCode,
          googleId: googleUser.googleId || googleUser.id,
          profilePicture: googleUser.profilePicture || googleUser.picture,
          authProvider: 'google'
        });
      } else if (!user.googleId) {
        // Link existing user with Google account
        user.googleId = googleUser.googleId || googleUser.id;
        user.profilePicture = googleUser.profilePicture || googleUser.picture;
        user.authProvider = 'google';
        await user.save();
      }

      return user;
    } catch (error) {
      throw new Error('Failed to find or create user');
    }
  }

  // Generate JWT token for user
  generateJWTToken(userId: string): string {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }
}

export default new GoogleAuthService();
