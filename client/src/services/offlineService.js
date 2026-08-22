import { useState, useEffect } from 'react';

class OfflineService {
  constructor() {
    this.online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.listeners = new Set();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  handleOnline = () => {
    this.online = true;
    this.notify();
  };

  handleOffline = () => {
    this.online = false;
    this.notify();
  };

  isOnline() {
    return this.online;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial call
    listener(this.online);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => {
      try {
        listener(this.online);
      } catch (err) {
        console.error('Error in offline subscriber:', err);
      }
    });
  }
}

export const offlineService = new OfflineService();

/**
 * Custom React hook for tracking online/offline status in real time
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const unsubscribe = offlineService.subscribe((status) => {
      setIsOnline(status);
    });
    return () => unsubscribe();
  }, []);

  return {
    isOnline,
    isOffline: !isOnline
  };
}
