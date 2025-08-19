// Authentication utilities
export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    whatsapp_number?: string;
    preferred_platforms?: string[];
    price_alert_threshold?: number;
  };
}

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const getCurrentUserId = (): string => {
  const user = getCurrentUser();
  return user?.id || 'demo-user'; // Fallback to demo-user if no user found
};

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!(token && user);
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
