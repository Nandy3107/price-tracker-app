import axios from 'axios';

export const sendWhatsAppNotification = async (phoneNumber: string, message: string) => {
    const apiUrl = 'https://api.whatsapp.com/send';
    const params = {
        phone: phoneNumber,
        text: message,
    };

    try {
        const response = await axios.get(apiUrl, { params });
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        throw new Error('Failed to send WhatsApp notification');
    }
};

export const generateAffiliateLink = (productUrl: string, affiliateId: string) => {
    const url = new URL(productUrl);
    url.searchParams.append('aff_id', affiliateId);
    return url.toString();
};

export const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
};

export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
    return ((originalPrice - discountedPrice) / originalPrice) * 100;
};