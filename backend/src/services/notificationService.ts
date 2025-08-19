// WhatsApp Notification Service
export const enableWhatsAppNotifications = async (userId: string, productId: string): Promise<boolean> => {
    // Stub: Replace with real WhatsApp API integration
    console.log(`Enabling WhatsApp notifications for user ${userId} and product ${productId}`);
    return true;
};

export const sendPriceDropNotification = async (phoneNumber: string, productName: string, newPrice: number): Promise<boolean> => {
    // Stub: Replace with real WhatsApp Business API
    console.log(`Sending WhatsApp notification to ${phoneNumber}: ${productName} price dropped to ₹${newPrice}`);
    return true;
};
