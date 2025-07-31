import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/components/Notifications/NotificationCenter';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate license expiry notifications for businesses
  useEffect(() => {
    const businesses = [
      { id: 'business-1', name: 'Demo Business Ltd.', licenseExpiry: new Date('2024-02-08') },
      { id: 'business-2', name: 'Tech Solutions Pvt Ltd', licenseExpiry: new Date('2024-02-15') },
      { id: 'business-3', name: 'Global Traders', licenseExpiry: new Date('2024-03-01') },
      { id: 'business-4', name: 'Sunrise Exports', licenseExpiry: new Date('2024-01-25') },
    ];

    const today = new Date();
    const generatedNotifications: Notification[] = [];

    businesses.forEach(business => {
      const daysUntilExpiry = Math.ceil(
        (business.licenseExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry <= 8 && daysUntilExpiry >= 0) {
        generatedNotifications.push({
          id: `license-expiry-${business.id}`,
          type: daysUntilExpiry <= 3 ? 'error' : 'warning',
          title: `License Expiring Soon`,
          message: `${business.name}'s license expires in ${daysUntilExpiry} days. Please initiate renewal process.`,
          timestamp: new Date(),
          isRead: false,
          businessId: business.id,
          businessName: business.name,
          actionRequired: true
        });
      } else if (daysUntilExpiry < 0) {
        generatedNotifications.push({
          id: `license-expired-${business.id}`,
          type: 'error',
          title: `License Expired`,
          message: `${business.name}'s license has expired ${Math.abs(daysUntilExpiry)} days ago. Immediate action required.`,
          timestamp: new Date(),
          isRead: false,
          businessId: business.id,
          businessName: business.name,
          actionRequired: true
        });
      }
    });

    // Add system notifications
    generatedNotifications.push({
      id: 'system-maintenance',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for tonight from 2:00 AM to 4:00 AM IST.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      actionRequired: false
    });

    setNotifications(generatedNotifications);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};