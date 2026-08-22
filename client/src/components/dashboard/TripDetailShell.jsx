import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Navigation,
  Sparkles,
  LayoutList,
  GitCommit,
  CheckCircle2,
  Compass,
  Wallet,
  TrendingUp,
  FileText,
  Share2,
  Train
} from 'lucide-react';
import { useTrips } from '../../context/TripContext';
import { StopModal } from '../trip-studio/StopModal';
import { ActivityPlanner } from '../ActivityPlanner';
import { BudgetDashboard } from '../BudgetDashboard';
import { ExportPdfButton } from '../ExportPdfButton';
import { PrintableTripDocument } from '../PrintableTripDocument';
import { ShareModal } from '../share/ShareModal';
import { LogisticsPanel } from '../logistics/LogisticsPanel';

export function TripDetailShell({ trip, onBack }) {
  const { deleteTrip, addStop, updateStop, deleteStop, moveStop } = useTrips();

  const [activeView, setActiveView] = useState('timeline'); // 'timeline' | 'cards' | 'logistics' | 'budget' | 'print'
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!trip) return null;

  const stops = trip.stops || [];

  // Real-time aggregates across the entire voyage (Hour 4 real-time sync & budget)
  const totalActivitiesCount = stops.reduce((sum, s) => sum + (s.activities?.length || 0), 0);
  const totalActivityExpenses = stops.reduce((sum, s) => {
    return sum + (s.activities || []).reduce((actSum, a) => actSum + (Number(a.cost) || 0), 0);
  }, 0);
  const totalBookedActivities = stops.reduce((sum, s) => {
    return sum + (s.activities || []).filter(a => a.isBooked).length;
  }, 0);
  const totalPlannedActivities = totalActivitiesCount - totalBookedActivities;
  const totalAllocatedStopBudget = stops.reduce((sum, s) => sum + (Number(s.budgetAllocation) || 0), 0);
  const overallBookingProgress = totalActivitiesCount > 0
    ? Math.round((totalBookedActivities / totalActivitiesCount) * 100)
    : 0;

  const formatDateRange = () => {
    if (!trip.startDate) return 'Dates TBD';
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (isNaN(start.getTime())) return 'Dates TBD';
    const s = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (isNaN(end.getTime())) return s;
    const e = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} – ${e}`;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'CA$',
      AUD: 'A$'
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${Number(amount || 0).toLocaleString()}`;
  };

  const calculateStayDays = (arr, dep) => {
    if (!arr || !dep) return null;
    const a = new Date(arr);
    const d = new Date(dep);
    if (isNaN(a.getTime()) || isNaN(d.getTime())) return null;
    const diff = Math.ceil((d - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const handleDeleteTrip = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
      deleteTrip(trip.id);
      onBack();
    }
  };

  const handleOpenAddStop = () => {
    setEditingStop(null);
    setIsStopModalOpen(true);
  };

  const handleOpenEditStop = (stop) => {
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

  const handleDeleteStop = (stopId, cityName) => {
    if (window.confirm(`Remove ${cityName} from this itinerary?`)) {
      deleteStop(trip.id, stopId);
    }
  };

  const handleMoveStop = (stopId, direction) => {
    moveStop(trip.id, stopId, direction);
  };

  return (
    <div className="app-container animate-fade-in" style={{ maxWidth: '960px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Share Itinerary Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
            title="Share Itinerary Link"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>

          {/* Hour 6: Export PDF & Print Button */}
          <ExportPdfButton trip={trip} printTargetId="printable-trip-document" />

          <button
            onClick={handleOpenAddStop}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add City Stop</span>
          </button>

          <button
            onClick={handleDeleteTrip}
            className="btn btn-danger btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Trash2 size={14} />
            <span>Delete Trip</span>
          </button>
        </div>
      </div>

      {/* Trip Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(17, 24, 39, 0.85) 100%)',
          marginBottom: '1.25rem',
          border: '1px solid rgba(56, 189, 248, 0.25)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.8rem',
              color: '#38bdf8',
              fontWeight: 600
            }}
          >
            <Calendar size={13} />
            {formatDateRange()}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.8rem',
              color: '#6ee7b7',
              fontWeight: 600
            }}
          >
            <DollarSign size={13} />
            Target: {formatCurrency(trip.totalBudget, trip.currency)} {trip.currency}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              fontSize: '0.8rem',
              color: '#d8b4fe',
              fontWeight: 600
            }}
          >
            <MapPin size={13} />
            {stops.length} {stops.length === 1 ? 'Destination City' : 'Destination Cities'}
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', color: '#ffffff', marginBottom: '0.6rem' }}>
          {trip.title}
        </h1>

        {trip.description && (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            {trip.description}
          </p>
        )}
      </div>

      {/* Real-time Trip Budget & Activities Pulse Bar (Hour 5 Sync Overview) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Metric 1: Total Trip Budget */}
        <div
          onClick={() => setActiveView('budget')}
          className="glass-card animate-fade-in"
          title="Click to open Financial Command Center"
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6))',
            border: activeView === 'budget' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <Wallet size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Target Budget
            </span>
            <h4 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
              {formatCurrency(trip.totalBudget, trip.currency)}
            </h4>
          </div>
        </div>

        {/* Metric 2: Live Activity Expenses */}
        <div
          onClick={() => setActiveView('budget')}
          className="glass-card animate-fade-in"
          title="Click to open Financial Command Center"
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Activity Total
            </span>
            <h4 style={{ fontSize: '1.25rem', color: '#34d399', fontWeight: 700, margin: 0 }}>
              {formatCurrency(totalActivityExpenses, trip.currency)}
            </h4>
          </div>
        </div>

        {/* Metric 3: City Budget Allocations */}
        <div
          onClick={() => setActiveView('budget')}
          className="glass-card animate-fade-in"
          title="Click to open Financial Command Center"
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}
          >
            <DollarSign size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Stops Allocated
            </span>
            <h4 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
              {formatCurrency(totalAllocatedStopBudget, trip.currency)}
            </h4>
          </div>
        </div>

        {/* Metric 4: Booked vs Planned Readiness */}
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Activities Booked
            </span>
            <span style={{ fontSize: '0.78rem', color: overallBookingProgress === 100 ? '#6ee7b7' : '#38bdf8', fontWeight: 700 }}>
              {overallBookingProgress}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <h4 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
              {totalBookedActivities}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              of {totalActivitiesCount} experiences confirmed
            </span>
          </div>

          {/* Mini progress line */}
          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${overallBookingProgress}%`,
                height: '100%',
                background: overallBookingProgress === 100 ? '#10b981' : 'linear-gradient(90deg, #38bdf8, #a855f7)',
                borderRadius: '2px'
              }}
            />
          </div>
        </div>
      </div>

      {/* View Toggle Bar & Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', color: '#ffffff', margin: 0 }}>
            {activeView === 'budget'
              ? 'Trip Budget & Expense Tracker'
              : activeView === 'logistics'
              ? 'Transport & Accommodation Logistics'
              : activeView === 'print'
              ? 'Printable Trip Document & PDF Manifest'
              : 'Multi-City Itinerary & Route Flow'}
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
            {activeView === 'budget'
              ? 'Real-time multi-currency expense ledger, category breakdown, and financial health alerts.'
              : activeView === 'logistics'
              ? 'Track hotel reservations, booking confirmation codes, trains, flights, and road transit.'
              : activeView === 'print'
              ? 'Clean formatted printable itinerary ready for PDF download or Ctrl + P printing.'
              : 'Sequential timeline of stops. Use Move Up (↑) / Down (↓) to reorder cities.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveView('timeline')}
            className={`btn btn-sm ${activeView === 'timeline' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            <GitCommit size={14} />
            <span>Visual Timeline</span>
          </button>
          <button
            onClick={() => setActiveView('cards')}
            className={`btn btn-sm ${activeView === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            <LayoutList size={14} />
            <span>Stop Cards</span>
          </button>
          <button
            onClick={() => setActiveView('logistics')}
            className={`btn btn-sm ${activeView === 'logistics' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            <Train size={14} />
            <span>Logistics & Stays</span>
          </button>
          <button
            onClick={() => setActiveView('budget')}
            className={`btn btn-sm ${activeView === 'budget' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            <Wallet size={14} />
            <span>Budget & Expenses</span>
          </button>
          <button
            onClick={() => setActiveView('print')}
            className={`btn btn-sm ${activeView === 'print' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            <FileText size={14} />
            <span>Print / PDF Manifest</span>
          </button>
        </div>
      </div>

      {/* Main View Content: Logistics vs Budget vs Print View vs Stops Views */}
      {activeView === 'logistics' ? (
        <LogisticsPanel trip={trip} />
      ) : activeView === 'budget' ? (
        <BudgetDashboard trip={trip} />
      ) : activeView === 'print' ? (
        <PrintableTripDocument trip={trip} />
      ) : stops.length > 0 ? (
        activeView === 'timeline' ? (
          /* Sequential Timeline View */
          <div style={{ position: 'relative', paddingLeft: '32px', marginTop: '1rem' }}>
            {/* Vertical Glowing Route Line */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                bottom: '24px',
                left: '12px',
                width: '3px',
                background: 'linear-gradient(180deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%)',
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)'
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {stops.map((stop, index) => {
                const stayDays = calculateStayDays(stop.arrivalDate, stop.departureDate);
                const isFirst = index === 0;
                const isLast = index === stops.length - 1;
                const nextStop = !isLast ? stops[index + 1] : null;

                const stopActivities = stop.activities || [];
                const stopTotalExpense = stopActivities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
                const stopBookedCount = stopActivities.filter(a => a.isBooked).length;

                return (
                  <div
                    key={stop.id || index}
                    className="animate-fade-in"
                    style={{ position: 'relative' }}
                  >
                    {/* Node Pin */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-32px',
                        top: '6px',
                        transform: 'translateX(-50%)',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                        border: '2px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 14px rgba(56, 189, 248, 0.8)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        zIndex: 2
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Stop Card */}
                    <div
                      className="glass-card"
                      style={{
                        padding: '1.25rem 1.5rem',
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.75))',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700 }}>
                              {stop.cityName}
                            </h3>
                            {stop.country && (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                • {stop.country}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                              <Calendar size={13} />
                              {stop.arrivalDate} – {stop.departureDate}
                            </span>
                            {stayDays && (
                              <>
                                <span>•</span>
                                <span style={{ color: '#10b981', fontWeight: 600 }}>
                                  {stayDays} {stayDays === 1 ? 'day stay' : 'days stay'}
                                </span>
                              </>
                            )}
                            {stop.budgetAllocation > 0 && (
                              <>
                                <span>•</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                                  Stop Budget: {formatCurrency(stop.budgetAllocation, trip.currency)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Reorder and Edit Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveStop(stop.id, 'up')}
                            className="btn btn-secondary btn-icon"
                            title="Move Stop Up in Route"
                            style={{
                              padding: '6px',
                              opacity: isFirst ? 0.3 : 1,
                              cursor: isFirst ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <ArrowUp size={14} />
                          </button>

                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveStop(stop.id, 'down')}
                            className="btn btn-secondary btn-icon"
                            title="Move Stop Down in Route"
                            style={{
                              padding: '6px',
                              opacity: isLast ? 0.3 : 1,
                              cursor: isLast ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <ArrowDown size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditStop(stop)}
                            className="btn btn-secondary btn-icon"
                            title="Edit Stop Details"
                            style={{ padding: '6px' }}
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteStop(stop.id, stop.cityName)}
                            className="btn btn-danger btn-icon"
                            title="Delete Stop"
                            style={{ padding: '6px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Notes / Logistics */}
                      {stop.notes && (
                        <div
                          style={{
                            marginTop: '0.85rem',
                            padding: '0.65rem 0.9rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            fontSize: '0.825rem',
                            color: 'var(--text-muted)'
                          }}
                        >
                          💡 <strong style={{ color: 'var(--text-main)' }}>Notes & Logistics:</strong> {stop.notes}
                        </div>
                      )}

                      {/* Hour 4: Embedded Activity Planner for this Stop */}
                      <ActivityPlanner
                        tripId={trip.id}
                        stop={stop}
                        currency={trip.currency}
                        isCollapsedDefault={false}
                      />
                    </div>

                    {/* Transit Leg Indicator */}
                    {nextStop && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          margin: '0.65rem 0 0 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(99, 102, 241, 0.12)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          fontSize: '0.78rem',
                          color: '#a5b4fc',
                          fontWeight: 600
                        }}
                      >
                        <Navigation size={12} style={{ transform: 'rotate(90deg)' }} />
                        <span>Next Leg: ➔ Transit to <strong>{nextStop.cityName}</strong></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {stops.map((stop, index) => {
              const isFirst = index === 0;
              const isLast = index === stops.length - 1;

              return (
                <div
                  key={stop.id || index}
                  className="glass-card animate-fade-in"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(56, 189, 248, 0.2)',
                          color: '#38bdf8',
                          fontWeight: 700
                        }}
                      >
                        Stop #{index + 1}
                      </span>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveStop(stop.id, 'up')}
                          className="btn btn-ghost btn-icon"
                          style={{ padding: '3px', opacity: isFirst ? 0.3 : 1 }}
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveStop(stop.id, 'down')}
                          className="btn btn-ghost btn-icon"
                          style={{ padding: '3px', opacity: isLast ? 0.3 : 1 }}
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                      {stop.cityName}
                    </h3>
                    {stop.country && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {stop.country}
                      </p>
                    )}

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>📅 {stop.arrivalDate} – {stop.departureDate}</span>
                      {stop.budgetAllocation > 0 && (
                        <span>💰 Budget: {formatCurrency(stop.budgetAllocation, trip.currency)}</span>
                      )}
                    </div>

                    {stop.notes && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                        {stop.notes}
                      </p>
                    )}

                    {/* Embedded Activity Planner in Cards view */}
                    <ActivityPlanner
                      tripId={trip.id}
                      stop={stop}
                      currency={trip.currency}
                      isCollapsedDefault={true}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditStop(stop)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      <Edit2 size={12} />
                      <span>Edit Stop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStop(stop.id, stop.cityName)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <MapPin size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.3rem' }}>
              No City Stops in this Journey Yet
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
              Add your first destination city to start building the sequential itinerary and timeline roadmap.
            </p>
          </div>
          <button
            onClick={handleOpenAddStop}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add First Stop</span>
          </button>
        </div>
      )}

      {/* Add / Edit Stop Modal */}
      <StopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onSave={handleSaveStop}
        initialData={editingStop}
      />

      {/* Share Itinerary Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={trip}
        onOpenPublicView={() => {
          setIsShareModalOpen(false);
          window.location.hash = `#share/${trip.shareToken || trip.id}`;
        }}
      />

      {/* Off-screen Document for 1-Click PDF Snapshot when not on Print tab */}
      {activeView !== 'print' && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '900px', pointerEvents: 'none' }} aria-hidden="true">
          <PrintableTripDocument trip={trip} />
        </div>
      )}
    </div>
  );
}
