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

  const refreshTrips = useCallback(async () => {
    if (!currentUser) {
      setTrips([]);
      setSelectedTrip(null);
      return;
    }
    try {
      const userTrips = await storageService.getTrips(currentUser.id);
      setTrips(userTrips);
      if (selectedTrip) {
        const refreshed = await storageService.getTripById(selectedTrip.id || selectedTrip._id, currentUser.id);
        if (refreshed) setSelectedTrip(refreshed);
      }
    } catch (err) {
      console.warn('Error refreshing trips:', err);
    }
  }, [currentUser, selectedTrip?.id, selectedTrip?._id]);

  useEffect(() => {
    refreshTrips();
  }, [currentUser]);

  const createTrip = async (tripData) => {
    if (!currentUser) throw new Error('You must be signed in to create a trip.');
    try {
      const newTrip = await storageService.createTrip(tripData, currentUser.id);
      await refreshTrips();
      showToast(`Trip "${newTrip.title}" planned with ${newTrip.stops?.length || 0} stops!`);
      return newTrip;
    } catch (err) {
      showToast(err.message || 'Failed to create trip.', 'error');
      throw err;
    }
  };

  const updateTrip = async (tripId, tripData) => {
    if (!currentUser) return null;
    try {
      const updated = await storageService.updateTrip(tripId, tripData, currentUser.id);
      await refreshTrips();
      if (selectedTrip && (selectedTrip.id === tripId || selectedTrip._id === tripId)) {
        setSelectedTrip(updated);
      }
      showToast('Trip updated successfully.');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update trip.', 'error');
      throw err;
    }
  };

  const deleteTrip = async (tripId) => {
    if (!currentUser) return;
    try {
      const success = await storageService.deleteTrip(tripId, currentUser.id);
      if (success) {
        if (selectedTrip && (selectedTrip.id === tripId || selectedTrip._id === tripId)) {
          setSelectedTrip(null);
        }
        await refreshTrips();
        showToast('Trip deleted.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete trip.', 'error');
    }
  };

  const selectTrip = async (tripOrId) => {
    if (!currentUser) return;
    if (typeof tripOrId === 'object' && tripOrId !== null) {
      setSelectedTrip(tripOrId);
      return;
    }
    const trip = await storageService.getTripById(tripOrId, currentUser.id);
    setSelectedTrip(trip);
  };

  const clearSelectedTrip = () => {
    setSelectedTrip(null);
  };

  // --- Stop Management Actions ---
  const addStop = async (tripId, stopData) => {
    if (!currentUser) return null;
    try {
      const newStop = await storageService.addStop(tripId, stopData, currentUser.id);
      await refreshTrips();
      showToast(`Added ${newStop.cityName} to itinerary.`);
      return newStop;
    } catch (err) {
      showToast(err.message || 'Failed to add stop.', 'error');
      throw err;
    }
  };

  const updateStop = async (tripId, stopId, stopData) => {
    if (!currentUser) return null;
    try {
      const updated = await storageService.updateStop(tripId, stopId, stopData, currentUser.id);
      await refreshTrips();
      showToast(`Updated ${updated.cityName} details.`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update stop.', 'error');
      throw err;
    }
  };

  const deleteStop = async (tripId, stopId) => {
    if (!currentUser) return false;
    try {
      const success = await storageService.deleteStop(tripId, stopId, currentUser.id);
      if (success) {
        await refreshTrips();
        showToast('City stop removed.', 'info');
      }
      return success;
    } catch (err) {
      showToast(err.message || 'Failed to remove stop.', 'error');
      throw err;
    }
  };

  const moveStop = async (tripId, stopId, direction) => {
    if (!currentUser) return false;
    try {
      const stops = await storageService.moveStop(tripId, stopId, direction, currentUser.id);
      if (stops) {
        await refreshTrips();
      }
      return stops;
    } catch (err) {
      showToast(err.message || 'Failed to reorder stop.', 'error');
      throw err;
    }
  };

  const reorderStops = async (tripId, orderedStopIds) => {
    if (!currentUser) return false;
    try {
      const stops = await storageService.reorderStops(tripId, orderedStopIds, currentUser.id);
      if (stops) {
        await refreshTrips();
      }
      return stops;
    } catch (err) {
      showToast(err.message || 'Failed to reorder stops.', 'error');
      throw err;
    }
  };

  // --- Activities Management Actions (Hour 4) ---
  const addActivity = async (tripId, stopId, activityData) => {
    if (!currentUser) return null;
    try {
      const newActivity = await storageService.addActivity(tripId, stopId, activityData, currentUser.id);
      await refreshTrips();
      showToast(`Added activity "${newActivity.title}"!`);
      return newActivity;
    } catch (err) {
      showToast(err.message || 'Failed to add activity.', 'error');
      throw err;
    }
  };

  const updateActivity = async (tripId, stopId, activityId, activityData) => {
    if (!currentUser) return null;
    try {
      const updated = await storageService.updateActivity(tripId, stopId, activityId, activityData, currentUser.id);
      await refreshTrips();
      showToast(`Updated "${updated.title}".`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update activity.', 'error');
      throw err;
    }
  };

  const deleteActivity = async (tripId, stopId, activityId) => {
    if (!currentUser) return false;
    try {
      const success = await storageService.deleteActivity(tripId, stopId, activityId, currentUser.id);
      if (success) {
        await refreshTrips();
        showToast('Activity removed from itinerary.', 'info');
      }
      return success;
    } catch (err) {
      showToast(err.message || 'Failed to remove activity.', 'error');
      throw err;
    }
  };

  const toggleActivityBooking = async (tripId, stopId, activityId) => {
    if (!currentUser) return null;
    try {
      const updated = await storageService.toggleActivityBooking(tripId, stopId, activityId, currentUser.id);
      await refreshTrips();
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
  const addExpense = async (tripId, expenseData) => {
    if (!currentUser) return null;
    try {
      const newExpense = await storageService.addExpense(tripId, expenseData, currentUser.id);
      await refreshTrips();
      showToast(`Logged expense: ${newExpense.category} (${newExpense.currency} ${newExpense.amount})`);
      return newExpense;
    } catch (err) {
      showToast(err.message || 'Failed to add expense.', 'error');
      throw err;
    }
  };

  const updateExpense = async (tripId, expenseId, expenseData) => {
    if (!currentUser) return null;
    try {
      const updated = await storageService.updateExpense(tripId, expenseId, expenseData, currentUser.id);
      await refreshTrips();
      showToast(`Updated expense: ${updated.category}.`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update expense.', 'error');
      throw err;
    }
  };

  const deleteExpense = async (tripId, expenseId) => {
    if (!currentUser) return false;
    try {
      const success = await storageService.deleteExpense(tripId, expenseId, currentUser.id);
      if (success) {
        await refreshTrips();
        showToast('Expense removed from budget log.', 'info');
      }
      return success;
    } catch (err) {
      showToast(err.message || 'Failed to remove expense.', 'error');
      throw err;
    }
  };

  const setTripBudget = async (tripId, totalBudget, currency) => {
    if (!currentUser) return null;
    try {
      const updated = await storageService.setTripBudget(tripId, totalBudget, currency, currentUser.id);
      await refreshTrips();
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

