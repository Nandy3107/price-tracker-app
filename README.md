# 🛒 AI-Powered Price Tracker with WhatsApp Notifications

A comprehensive price tracking application with Gmail OAuth authentication, Gemini 2.0 Flash AI integration, and real-time WhatsApp notifications.

## ✨ Features

### 🔐 Authentication
- **Gmail OAuth Integration**: Seamless Google Sign-In
- **JWT Token Management**: Secure session handling
- **Multi-provider Support**: Local & Google authentication

### 🤖 AI Integration
- **Gemini 2.0 Flash**: Latest Google AI model
- **Intelligent Price Analysis**: AI-powered market insights
- **Smart Recommendations**: Personalized shopping advice
- **Fallback Support**: Multiple AI providers (OpenAI, Claude, Perplexity)

### 📱 WhatsApp Notifications
- **Real-time Alerts**: Instant price drop notifications
- **Target Price Tracking**: Custom price alerts
- **Rich Messages**: Product details, savings, buy links
- **QR Authentication**: Easy WhatsApp Web setup

### 💰 Price Tracking
- **Multi-platform Support**: Amazon, Flipkart, Myntra, and more
- **Historical Data**: Price trend analysis
- **Automated Monitoring**: Background price checking
- **Affiliate Integration**: Earn commissions

### 🔧 Technical Stack
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Frontend**: React, TypeScript, Modern UI
- **AI**: Gemini 2.0 Flash, OpenAI compatibility
- **Notifications**: WhatsApp Web.js
- **Database**: MongoDB with Mongoose

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- Google Cloud Project (for OAuth & Gemini)

### Installation

1. **Clone & Setup**
```bash
cd price-tracker-app
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
```bash
# Edit backend/.env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost:27017/price-tracker
JWT_SECRET=your_jwt_secret
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

5. **Start Application**
```bash
# From root directory
start.bat
```

## 📱 WhatsApp Setup

1. **First Time Setup**:
   - Run the backend server
   - Scan QR code displayed in console with WhatsApp
   - Authentication will be saved for future use

2. **Adding Phone Numbers**:
   - Users can add WhatsApp numbers in their profile
   - Format: +91XXXXXXXXXX (with country code)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - OAuth callback

### Price Tracking
- `POST /api/products/track` - Track new product
- `GET /api/products/monitored` - Get tracked products
- `POST /api/products/compare` - Compare prices
- `POST /api/wishlist/notify` - Send price alerts

### AI Features
- `POST /api/ai/chat` - AI shopping assistant
- `POST /api/ai/analyze` - Price analysis
- `GET /api/ai/providers` - Available AI models

## 💡 Usage Examples

### Track a Product
```javascript
const product = await fetch('/api/products/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://amazon.in/product-url',
    targetPrice: 15000
  })
});
```

### Get AI Recommendations
```javascript
const advice = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Should I buy this laptop now or wait?',
    productContext: productData
  })
});
```

## 🔒 Security Features

- JWT token authentication
- CORS protection
- Input validation & sanitization
- Rate limiting
- Secure OAuth implementation

## 📊 Monitoring & Analytics

- Real-time price change detection
- Historical price trends
- AI-powered market analysis
- User engagement metrics
- Notification delivery tracking

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # TypeScript hot reload
```

### Frontend Development
```bash
cd frontend
npm start  # React development server
```

### Build for Production
```bash
npm run build  # Both frontend & backend
```

## 📋 Environment Variables

### Required
- `GEMINI_API_KEY` - Google Gemini API key
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret

### Optional
- `GOOGLE_CLIENT_ID` - For OAuth
- `GOOGLE_CLIENT_SECRET` - For OAuth
- `OPENAI_API_KEY` - OpenAI fallback
- `CLAUDE_API_KEY` - Claude fallback
- `PERPLEXITY_API_KEY` - Perplexity fallback

## 🚀 Deployment

### Local Development
Use `start.bat` for Windows or create equivalent script for other OS.

### Production Deployment
1. Set production environment variables
2. Build both frontend and backend
3. Deploy to your preferred hosting service
4. Configure MongoDB production instance
5. Set up WhatsApp Business API (optional)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use for personal and commercial projects.

## 🆘 Support

For issues and support:
1. Check the console logs for detailed error messages
2. Ensure all environment variables are properly set
3. Verify MongoDB connection
4. Check WhatsApp authentication status

---

**Built with ❤️ using modern web technologies and AI**