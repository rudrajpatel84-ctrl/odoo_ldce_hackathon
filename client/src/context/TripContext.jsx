import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const { currentUser } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.id === toast?.id ? null : prev));
    }, 3500);
  };

  const refreshTrips = useCallback(() => {
    if (!currentUser) {
      setTrips([]);
      setSelectedTrip(null);
      return;
    }
    const userTrips = storageService.getTrips(currentUser.id);
    setTrips(userTrips);
    if (selectedTrip) {
      const refreshed = storageService.getTripById(selectedTrip.id, currentUser.id);
      setSelectedTrip(refreshed);
    }
  }, [currentUser, selectedTrip?.id]);

  useEffect(() => {
    refreshTrips();
  }, [currentUser]);

  const createTrip = (tripData) => {
    if (!currentUser) throw new Error('You must be signed in to create a trip.');
    try {
      const newTrip = storageService.createTrip(tripData, currentUser.id);
      refreshTrips();
      showToast(`Trip "${newTrip.title}" planned successfully!`);
      return newTrip;
    } catch (err) {
      showToast(err.message || 'Failed to create trip.', 'error');
      throw err;
    }
  };

  const deleteTrip = (tripId) => {
    if (!currentUser) return;
    const success = storageService.deleteTrip(tripId, currentUser.id);
    if (success) {
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(null);
      }
      refreshTrips();
      showToast('Trip deleted.', 'info');
    }
  };

  const selectTrip = (tripId) => {
    if (!currentUser) return;
    const trip = storageService.getTripById(tripId, currentUser.id);
    setSelectedTrip(trip);
  };

  const clearSelectedTrip = () => {
    setSelectedTrip(null);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        selectedTrip,
        loading,
        toast,
        createTrip,
        deleteTrip,
        selectTrip,
        clearSelectedTrip,
        refreshTrips,
        showToast
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
