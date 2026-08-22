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
      showToast(`Trip "${newTrip.title}" planned with ${newTrip.stops?.length || 0} stops!`);
      return newTrip;
    } catch (err) {
      showToast(err.message || 'Failed to create trip.', 'error');
      throw err;
    }
  };

  const updateTrip = (tripId, tripData) => {
    if (!currentUser) return null;
    try {
      const updated = storageService.updateTrip(tripId, tripData, currentUser.id);
      refreshTrips();
      showToast('Trip updated successfully.');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update trip.', 'error');
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

  // --- Stop Management Actions ---
  const addStop = (tripId, stopData) => {
    if (!currentUser) return null;
    try {
      const newStop = storageService.addStop(tripId, stopData, currentUser.id);
      refreshTrips();
      showToast(`Added ${newStop.cityName} to itinerary.`);
      return newStop;
    } catch (err) {
      showToast(err.message || 'Failed to add stop.', 'error');
      throw err;
    }
  };

  const updateStop = (tripId, stopId, stopData) => {
    if (!currentUser) return null;
    try {
      const updated = storageService.updateStop(tripId, stopId, stopData, currentUser.id);
      refreshTrips();
      showToast(`Updated ${updated.cityName} details.`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update stop.', 'error');
      throw err;
    }
  };

  const deleteStop = (tripId, stopId) => {
    if (!currentUser) return false;
    try {
      const success = storageService.deleteStop(tripId, stopId, currentUser.id);
      if (success) {
        refreshTrips();
        showToast('City stop removed.', 'info');
      }
      return success;
    } catch (err) {
      showToast(err.message || 'Failed to remove stop.', 'error');
      throw err;
    }
  };

  const moveStop = (tripId, stopId, direction) => {
    if (!currentUser) return false;
    try {
      const stops = storageService.moveStop(tripId, stopId, direction, currentUser.id);
      if (stops) {
        refreshTrips();
      }
      return stops;
    } catch (err) {
      showToast(err.message || 'Failed to reorder stop.', 'error');
      throw err;
    }
  };

  const reorderStops = (tripId, orderedStopIds) => {
    if (!currentUser) return false;
    try {
      const stops = storageService.reorderStops(tripId, orderedStopIds, currentUser.id);
      if (stops) {
        refreshTrips();
      }
      return stops;
    } catch (err) {
      showToast(err.message || 'Failed to reorder stops.', 'error');
      throw err;
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        selectedTrip,
        loading,
        toast,
        createTrip,
        updateTrip,
        deleteTrip,
        selectTrip,
        clearSelectedTrip,
        refreshTrips,
        showToast,
        addStop,
        updateStop,
        deleteStop,
        moveStop,
        reorderStops
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

