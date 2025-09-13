import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/entities/User';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id, timestamp: Date.now() };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    user,
    setUser,
    isLoading,
    notifications,
    addNotification,
    removeNotification,
    refreshUser: loadUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}