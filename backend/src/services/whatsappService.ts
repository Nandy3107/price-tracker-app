import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';

interface WhatsAppMessage {
  to: string; // Phone number with country code (e.g., '919876543210')
  message: string;
  productInfo?: {
    name: string;
    currentPrice: number;
    targetPrice: number;
    platform: string;
    url: string;
    image?: string;
  };
}

class WhatsAppNotificationService {
  private client: Client;
  private isReady: boolean = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'pricetracker-bot',
        dataPath: './whatsapp-session'
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.initializeClient();
  }

  private initializeClient(): void {
    // Generate QR code for WhatsApp Web login
    this.client.on('qr', (qr) => {
      console.log('📱 WhatsApp QR Code - Scan with your phone:');
      qrcode.generate(qr, { small: true });
      console.log('📲 Or visit WhatsApp Web and scan the QR code above');
    });

    // Client ready
    this.client.on('ready', () => {
      console.log('✅ WhatsApp Client is ready!');
      this.isReady = true;
    });

    // Authentication successful
    this.client.on('authenticated', () => {
      console.log('🔐 WhatsApp authenticated successfully');
    });

    // Authentication failed
    this.client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp authentication failed:', msg);
    });

    // Client disconnected
    this.client.on('disconnected', (reason) => {
      console.log('🔌 WhatsApp client disconnected:', reason);
      this.isReady = false;
    });

    // Listen for incoming WhatsApp messages
    this.client.on('message', async (msg) => {
      try {
        const chat = await msg.getChat();
        console.log(`💬 Received WhatsApp message from ${msg.from}: ${msg.body}`);
        // Example: Automated reply
        if (msg.body.toLowerCase().includes('price')) {
          await msg.reply('👋 Hi! I am your Price Tracker bot. Send me a product name or link to get price alerts.');
        } else {
          await msg.reply('🤖 Thanks for your message! Type "price" to get started with price tracking.');
        }
        // You can add more logic here to trigger backend actions
      } catch (err) {
        console.error('❌ Error processing incoming WhatsApp message:', err);
      }
    });

    // Start the client
    this.client.initialize();
  }

  // Send price alert notification
  async sendPriceAlert(notification: WhatsAppMessage): Promise<boolean> {
    try {
      if (!this.isReady) {
        console.log('⚠️ WhatsApp client not ready, storing notification for later...');
        await this.storeOfflineNotification(notification);
        return false;
      }

      const { to, message, productInfo } = notification;
      const formattedNumber = this.formatPhoneNumber(to);

      // Create rich notification message
      let richMessage = `🔔 *Price Alert - Price Tracker*\n\n`;
      
      if (productInfo) {
        richMessage += `📱 *${productInfo.name}*\n`;
        richMessage += `💰 *Current Price:* ₹${productInfo.currentPrice}\n`;
        richMessage += `🎯 *Target Price:* ₹${productInfo.targetPrice}\n`;
        richMessage += `📊 *Platform:* ${productInfo.platform}\n`;
        richMessage += `💡 *Savings:* ₹${productInfo.targetPrice - productInfo.currentPrice}\n\n`;
        richMessage += `🛒 *Buy Now:* ${productInfo.url}\n\n`;
      }

      richMessage += `${message}\n\n`;
      richMessage += `⚡ *Powered by AI Price Tracker*\n`;
      richMessage += `🤖 Smart shopping assistant with real-time alerts`;

      // Send the message
      await this.client.sendMessage(formattedNumber, richMessage);

      // Send product image if available
      if (productInfo?.image) {
        try {
          const media = await MessageMedia.fromUrl(productInfo.image);
          await this.client.sendMessage(formattedNumber, media, {
            caption: `📸 ${productInfo.name} - Click the link above to buy now!`
          });
        } catch (imgError) {
          console.log('📷 Could not send product image:', imgError);
        }
      }

      console.log(`✅ WhatsApp notification sent to ${to}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send WhatsApp notification:', error);
      await this.storeOfflineNotification(notification);
      return false;
    }
  }

  // Format phone number for WhatsApp (must include country code)
  private formatPhoneNumber(phone: string): string {
    // Remove any non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present (default to India +91)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    return cleaned + '@c.us';
  }

  // Store notifications when WhatsApp is offline
  private async storeOfflineNotification(notification: WhatsAppMessage): Promise<void> {
    try {
      const offlineFile = path.join(__dirname, '../../data/offline-notifications.json');
      const dir = path.dirname(offlineFile);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let notifications = [];
      if (fs.existsSync(offlineFile)) {
        const data = fs.readFileSync(offlineFile, 'utf8');
        notifications = JSON.parse(data);
      }

      notifications.push({
        ...notification,
        timestamp: new Date(),
        status: 'pending'
      });

      fs.writeFileSync(offlineFile, JSON.stringify(notifications, null, 2));
      console.log('💾 Notification stored for later delivery');
    } catch (error) {
      console.error('❌ Failed to store offline notification:', error);
    }
  }

  // Send pending notifications when client comes online
  async processPendingNotifications(): Promise<void> {
    try {
      const offlineFile = path.join(__dirname, '../../data/offline-notifications.json');
      
      if (!fs.existsSync(offlineFile)) return;

      const data = fs.readFileSync(offlineFile, 'utf8');
      const notifications = JSON.parse(data);
      const pending = notifications.filter((n: any) => n.status === 'pending');

      console.log(`📤 Processing ${pending.length} pending notifications...`);

      for (const notification of pending) {
        const success = await this.sendPriceAlert(notification);
        if (success) {
          notification.status = 'sent';
          notification.sentAt = new Date();
        }
      }

      // Update the file with sent statuses
      fs.writeFileSync(offlineFile, JSON.stringify(notifications, null, 2));
      console.log('✅ Pending notifications processed');
    } catch (error) {
      console.error('❌ Failed to process pending notifications:', error);
    }
  }

  // Get WhatsApp service status
  getStatus(): { ready: boolean; connected: boolean } {
    return {
      ready: this.isReady,
      connected: this.client.info ? true : false
    };
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    try {
      await this.client.destroy();
      console.log('🔌 WhatsApp client shut down gracefully');
    } catch (error) {
      console.error('❌ Error during WhatsApp client shutdown:', error);
    }
  }
}

export default new WhatsAppNotificationService();
