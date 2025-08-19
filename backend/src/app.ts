import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';
import aiRoutes from './routes/aiRoutes';
import realTimePriceMonitor from './services/realTimePriceMonitor';
import dotenv from 'dotenv';
import { startPriceUpdateScheduler } from './services/priceUpdateService';
import whatsappService from './services/whatsappService';
import storeCatalogRoutes from './routes/storeCatalogRoutes';
import importProductRoutes from './routes/importProductRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 to match frontend API config

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/price-tracker')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api', routes);
app.use('/api/ai', aiRoutes);
app.use('/api/stores', storeCatalogRoutes);
app.use('/api/import-product', importProductRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Price Tracker Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/ai/chat`);
    
    // Start automatic price updates
    startPriceUpdateScheduler();
    
    // Start real-time price monitoring
    if (process.env.ENABLE_REAL_TIME_MONITORING !== 'false') {
        console.log(`🔍 Starting real-time price monitoring...`);
        await realTimePriceMonitor.startRealTimeMonitoring();
    }

    // Initialize WhatsApp service
    try {
        await whatsappService;
        console.log('📱 WhatsApp service initialized');
    } catch (err) {
        console.error('❌ WhatsApp service failed to initialize:', err);
    }
    
    console.log(`🤖 AI Shopping Assistant with Gemini/Perplexity/OpenAI fallback`);
    console.log(`✅ Real-time price monitoring active`);
});