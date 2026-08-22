import React, { useState } from 'react';
import { Calendar, DollarSign, Clock, ArrowRight, Trash2, MapPin } from 'lucide-react';

export function TripCard({ trip, onOpenTrip, onDeleteTrip }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const formatDateRange = () => {
    if (!trip.startDate) return 'Dates TBD';
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    if (isNaN(start.getTime())) return 'Dates TBD';
    
    const startStr = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (isNaN(end.getTime())) return startStr;

    const endStr = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} – ${endStr}`;
  };

  const getDurationDays = () => {
    if (!trip.startDate || !trip.endDate) return null;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
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

  const duration = getDurationDays();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirmingDelete) {
      onDeleteTrip(trip.id);
    } else {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
    }
  };

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative'
      }}
    >
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: 600
              }}
            >
              <Calendar size={12} />
              {formatDateRange()}
            </span>

            {duration && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}
              >
                <Clock size={12} />
                {duration} {duration === 1 ? 'Day' : 'Days'}
              </span>
            )}
          </div>

          <button
            onClick={handleDeleteClick}
            className={`btn btn-icon btn-sm ${confirmingDelete ? 'btn-danger' : 'btn-ghost'}`}
            title={confirmingDelete ? 'Click again to confirm deletion' : 'Delete Trip'}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            <Trash2 size={14} color={confirmingDelete ? '#fca5a5' : 'var(--text-dim)'} />
            {confirmingDelete && <span>Confirm?</span>}
          </button>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.3 }}>
          {trip.title}
        </h3>

        {/* Description */}
        {trip.description && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
            {trip.description}
          </p>
        )}
      </div>

      {/* Footer info & CTA */}
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Target Budget
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#10b981' }}>
              {formatCurrency(trip.totalBudget, trip.currency)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{trip.currency}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Destinations
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {trip.stops?.length || 0} stops
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenTrip(trip.id)}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>View Trip Details</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
