import React, { useState } from 'react';
import { TripStudioHeader } from './TripStudioHeader';
import { TabNavigation } from './TabNavigation';
import { ItineraryTab } from './ItineraryTab';
import { BudgetTab } from './BudgetTab';
import { TimelineTab } from './TimelineTab';
import { StopModal } from './StopModal';
import { ActivityModal } from './ActivityModal';
import { ExpenseModal } from './ExpenseModal';
import { useTrips } from '../../context/TripContext';

export function TripStudioView({ tripId, onBack, onShare }) {
  const {
    trips,
    loadTrip,
    copyTrip,
    addStop,
    updateStop,
    deleteStop,
    addActivity,
    updateActivity,
    toggleActivity,
    deleteActivity,
    addExpense,
    deleteExpense
  } = useTrips();

  const trip = trips.find(t => t.id === tripId) || loadTrip(tripId);
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'budget' | 'timeline'

  // Modals state
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityTargetStopId, setActivityTargetStopId] = useState(null);
  const [activityDefaultDate, setActivityDefaultDate] = useState('');
  const [editingActivity, setEditingActivity] = useState(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  if (!trip) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Trip not found</h2>
        <button onClick={onBack} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Counts for tab badges
  const stopsCount = trip.stops ? trip.stops.length : 0;
  const expensesCount = trip.expenses ? trip.expenses.length : 0;
  const activitiesCount = (trip.stops || []).reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0);

  // Stop handlers
  const handleOpenAddStop = () => {
    setEditingStop(null);
    setIsStopModalOpen(true);
  };

  const handleEditStop = (stop) => {
    setEditingStop(stop);
    setIsStopModalOpen(true);
  };

  const handleSaveStop = (stopData) => {
    if (editingStop) {
      updateStop(trip.id, editingStop.id, stopData);
    } else {
      addStop(trip.id, stopData);
    }
  };

  // Activity handlers
  const handleOpenAddActivity = (stopId, defaultDate) => {
    setActivityTargetStopId(stopId);
    setActivityDefaultDate(defaultDate);
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (stopId, activity) => {
    setActivityTargetStopId(stopId);
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (activityData) => {
    if (editingActivity) {
      updateActivity(trip.id, activityTargetStopId, editingActivity.id, activityData);
    } else {
      addActivity(trip.id, activityTargetStopId, activityData);
    }
  };

  // Expense handlers
  const handleSaveExpense = (expenseData) => {
    addExpense(trip.id, expenseData);
  };

  return (
    <div className="app-container animate-fade-in">
      <TripStudioHeader
        trip={trip}
        onBack={onBack}
        onShare={onShare}
        onCopy={copyTrip}
      />

      <TabNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={{
          stops: stopsCount,
          expenses: expensesCount,
          activities: activitiesCount
        }}
      />

      {/* Tab Panels */}
      {activeTab === 'itinerary' && (
        <ItineraryTab
          trip={trip}
          onOpenAddStop={handleOpenAddStop}
          onEditStop={handleEditStop}
          onDeleteStop={deleteStop}
          onOpenAddActivity={handleOpenAddActivity}
          onEditActivity={handleEditActivity}
          onToggleActivity={toggleActivity}
          onDeleteActivity={deleteActivity}
        />
      )}

      {activeTab === 'budget' && (
        <BudgetTab
          trip={trip}
          onOpenAddExpense={() => setIsExpenseModalOpen(true)}
          onDeleteExpense={deleteExpense}
        />
      )}

      {activeTab === 'timeline' && (
        <TimelineTab trip={trip} />
      )}

      {/* Modals */}
      <StopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onSave={handleSaveStop}
        initialData={editingStop}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        initialData={editingActivity}
        defaultDate={activityDefaultDate}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        stops={trip.stops || []}
      />
    </div>
  );
}
