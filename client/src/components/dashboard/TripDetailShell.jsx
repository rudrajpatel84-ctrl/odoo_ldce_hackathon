import React from 'react';
import { ArrowLeft, Calendar, DollarSign, Clock, MapPin, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { useTrips } from '../../context/TripContext';

export function TripDetailShell({ trip, onBack }) {
  const { deleteTrip } = useTrips();

  if (!trip) return null;

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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
      deleteTrip(trip.id);
      onBack();
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ maxWidth: '900px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={handleDelete}
          className="btn btn-danger btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Trash2 size={14} />
          <span>Delete Trip</span>
        </button>
      </div>

      {/* Trip Header Card */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(17, 24, 39, 0.85) 100%)',
          marginBottom: '1.5rem'
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
        </div>

        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.6rem' }}>
          {trip.title}
        </h1>

        {trip.description && (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {trip.description}
          </p>
        )}
      </div>

      {/* Hour 3 Ready Callout */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          textAlign: 'center',
          border: '1px dashed rgba(56, 189, 248, 0.3)',
          background: 'rgba(56, 189, 248, 0.03)'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}
        >
          <MapPin size={24} />
        </div>

        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Ready for Hour 3: Multi-City Itinerary Stops
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
          In the next milestone (Hour 3), you will be able to add city stops (e.g. Tokyo, Kyoto, Osaka) with arrival/departure dates and reorder them with Move Up ↑ / Move Down ↓ controls.
        </p>
      </div>
    </div>
  );
}
