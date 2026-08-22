import { useState, useEffect } from 'react';
import { api } from './api';

const MUTATION_QUEUE_KEY = 'globetrotter_offline_mutations';

class OfflineService {
  constructor() {
    this.online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.isSyncing = false;
    this.listeners = new Set();
    this.syncListeners = new Set();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  handleOnline = async () => {
    this.online = true;
    this.notifyStatus();
    // Auto-sync when coming back online
    await this.processMutationQueue();
  };

  handleOffline = () => {
    this.online = false;
    this.notifyStatus();
  };

  isOnline() {
    return this.online;
  }

  getPendingMutationsCount() {
    try {
      const queue = JSON.parse(localStorage.getItem(MUTATION_QUEUE_KEY) || '[]');
      return queue.length;
    } catch {
      return 0;
    }
  }

  getQueue() {
    try {
      return JSON.parse(localStorage.getItem(MUTATION_QUEUE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  enqueueMutation(mutation) {
    try {
      const queue = this.getQueue();
      const item = {
        id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...mutation
      };
      queue.push(item);
      localStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(queue));
      this.notifySync({ pendingCount: queue.length, isSyncing: this.isSyncing });
      return item;
    } catch (err) {
      console.error('Failed to enqueue mutation:', err);
    }
  }

  async processMutationQueue(onTripRefresh = null) {
    if (this.isSyncing || !this.online || !api.getToken()) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    this.notifySync({ pendingCount: queue.length, isSyncing: true });

    const failed = [];

    for (const item of queue) {
      try {
        switch (item.type) {
          case 'CREATE_TRIP':
            await api.post('/trips', item.payload);
            break;
          case 'UPDATE_TRIP':
            await api.put(`/trips/${item.tripId}`, item.payload);
            break;
          case 'DELETE_TRIP':
            await api.delete(`/trips/${item.tripId}`);
            break;
          case 'ADD_STOP':
            await api.post(`/trips/${item.tripId}/stops`, item.payload);
            break;
          case 'UPDATE_STOP':
            await api.put(`/trips/${item.tripId}/stops/${item.stopId}`, item.payload);
            break;
          case 'DELETE_STOP':
            await api.delete(`/trips/${item.tripId}/stops/${item.stopId}`);
            break;
          case 'REORDER_STOPS':
            await api.put(`/trips/${item.tripId}/stops/reorder`, { stopIds: item.stopIds });
            break;
          case 'ADD_ACTIVITY':
            await api.post(`/trips/${item.tripId}/stops/${item.stopId}/activities`, item.payload);
            break;
          case 'UPDATE_ACTIVITY':
            await api.put(`/trips/${item.tripId}/stops/${item.stopId}/activities/${item.activityId}`, item.payload);
            break;
          case 'DELETE_ACTIVITY':
            await api.delete(`/trips/${item.tripId}/stops/${item.stopId}/activities/${item.activityId}`);
            break;
          case 'TOGGLE_ACTIVITY_BOOKING':
            await api.patch(`/trips/${item.tripId}/stops/${item.stopId}/activities/${item.activityId}/toggle-booking`);
            break;
          case 'ADD_EXPENSE':
            await api.post(`/trips/${item.tripId}/expenses`, item.payload);
            break;
          case 'UPDATE_EXPENSE':
            await api.put(`/trips/${item.tripId}/expenses/${item.expenseId}`, item.payload);
            break;
          case 'DELETE_EXPENSE':
            await api.delete(`/trips/${item.tripId}/expenses/${item.expenseId}`);
            break;
          case 'SET_BUDGET':
            await api.patch(`/trips/${item.tripId}/budget`, item.payload);
            break;
          case 'SET_ACCOMMODATION':
            await api.put(`/trips/${item.tripId}/stops/${item.stopId}/accommodation`, item.payload);
            break;
          case 'ADD_TRANSPORT':
            await api.post(`/trips/${item.tripId}/transports`, item.payload);
            break;
          case 'UPDATE_TRANSPORT':
            await api.put(`/trips/${item.tripId}/transports/${item.transportId}`, item.payload);
            break;
          case 'DELETE_TRANSPORT':
            await api.delete(`/trips/${item.tripId}/transports/${item.transportId}`);
            break;
          case 'TOGGLE_TRANSPORT_BOOKING':
            await api.patch(`/trips/${item.tripId}/transports/${item.transportId}/toggle-booking`);
            break;
          default:
            console.warn('Unknown offline mutation type:', item.type);
        }
      } catch (err) {
        console.warn(`Mutation ${item.type} replay error:`, err.message);
        failed.push(item);
      }
    }

    localStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(failed));
    this.isSyncing = false;
    this.notifySync({ pendingCount: failed.length, isSyncing: false });

    if (onTripRefresh) {
      try {
        await onTripRefresh();
      } catch {}
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.online);
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeSync(listener) {
    this.syncListeners.add(listener);
    listener({ pendingCount: this.getPendingMutationsCount(), isSyncing: this.isSyncing });
    return () => {
      this.syncListeners.delete(listener);
    };
  }

  notifyStatus() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.online);
      } catch (err) {
        console.error('Error in offline subscriber:', err);
      }
    });
  }

  notifySync(state) {
    this.syncListeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in sync subscriber:', err);
      }
    });
  }
}

export const offlineService = new OfflineService();

/**
 * Custom React hook for tracking online/offline status and pending mutations in real time
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncState, setSyncState] = useState({
    pendingCount: offlineService.getPendingMutationsCount(),
    isSyncing: false
  });

  useEffect(() => {
    const unsubStatus = offlineService.subscribe((status) => {
      setIsOnline(status);
    });

    const unsubSync = offlineService.subscribeSync((state) => {
      setSyncState(state);
    });

    return () => {
      unsubStatus();
      unsubSync();
    };
  }, []);

  const syncNow = async (onRefresh = null) => {
    await offlineService.processMutationQueue(onRefresh);
  };

  return {
    isOnline,
    isOffline: !isOnline,
    pendingCount: syncState.pendingCount,
    isSyncing: syncState.isSyncing,
    syncNow
  };
}
