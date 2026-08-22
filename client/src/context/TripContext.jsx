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

  // --- Activities Management Actions (Hour 4) ---
  const addActivity = (tripId, stopId, activityData) => {
    if (!currentUser) return null;
    try {
      const newActivity = storageService.addActivity(tripId, stopId, activityData, currentUser.id);
      refreshTrips();
      showToast(`Added activity "${newActivity.title}"!`);
      return newActivity;
    } catch (err) {
      showToast(err.message || 'Failed to add activity.', 'error');
      throw err;
    }
  };

  const updateActivity = (tripId, stopId, activityId, activityData) => {
    if (!currentUser) return null;
    try {
      const updated = storageService.updateActivity(tripId, stopId, activityId, activityData, currentUser.id);
      refreshTrips();
      showToast(`Updated "${updated.title}".`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update activity.', 'error');
      throw err;
    }
  };

  const deleteActivity = (tripId, stopId, activityId) => {
    if (!currentUser) return false;
    try {
      const success = storageService.deleteActivity(tripId, stopId, activityId, currentUser.id);
      if (success) {
        refreshTrips();
        showToast('Activity removed from itinerary.', 'info');
      }
      return success;
    } catch (err) {
      showToast(err.message || 'Failed to remove activity.', 'error');
      throw err;
    }
  };

  const toggleActivityBooking = (tripId, stopId, activityId) => {
    if (!currentUser) return null;
    try {
      const updated = storageService.toggleActivityBooking(tripId, stopId, activityId, currentUser.id);
      refreshTrips();
      showToast(
        updated.isBooked
          ? `Marked "${updated.title}" as Booked!`
          : `Marked "${updated.title}" as Planned.`
      );
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update booking status.', 'error');
      throw err;
    }
  };

  // --- Budget & Expenses Management Actions (Hour 5) ---
  const addExpense = (tripId, expenseData) => {
    if (!currentUser) return null;
    try {
      const newExpense = storageService.addExpense(tripId, expenseData, currentUser.id);
      refreshTrips();
      showToast(`Logged expense: ${newExpense.category} (${newExpense.currency} ${newExpense.amount})`);
      return newExpense;
    } catch (err) {
      showToast(err.message || 'Failed to add expense.', 'error');
      throw err;
    }
  };

  const updateExpense = (tripId, expenseId, expenseData) => {
    if (!currentUser) return null;
    try {
      const updated = storageService.updateExpense(tripId, expenseId, expenseData, currentUser.id);
      refreshTrips();
      showToast(`Updated expense: ${updated.category}.`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update expense.', 'error');
      throw err;
    }
  };

  const deleteExpense = (tripId, expenseId) => {
    if (!currentUser) return false;
    try {
      const success = storageService.deleteExpense(tripId, expenseId, currentUser.id);
      if (success) {
        refreshTrips();
        showToast('Expense removed from budget log.', 'info');
      }
      return success;
    } catch (err) {
      showToast(err.message || 'Failed to remove expense.', 'error');
      throw err;
    }
  };

  const setTripBudget = (tripId, totalBudget) => {
    if (!currentUser) return null;
    try {
      const updated = storageService.setTripBudget(tripId, totalBudget, currentUser.id);
      refreshTrips();
      showToast(`Trip budget updated to ${updated.currency} ${Number(totalBudget).toLocaleString()}!`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update budget.', 'error');
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
        reorderStops,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleActivityBooking,
        addExpense,
        updateExpense,
        deleteExpense,
        setTripBudget
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

