import React, { useState } from 'react';
import { Calendar, DollarSign, Clock, ArrowRight, Trash2, MapPin, Navigation, Eye, Share2 } from 'lucide-react';
import { SequentialTimelinePreview } from './SequentialTimelinePreview';
import { ShareModal } from '../share/ShareModal';

export function TripCard({ trip, onOpenTrip, onDeleteTrip }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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
      AUD: 'A$',
      INR: '₹'
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${Number(amount || 0).toLocaleString()}`;
  };

  const duration = getDurationDays();
  const stops = trip.stops || [];

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
    <>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareOpen(true);
                }}
                className="btn btn-icon btn-sm btn-ghost"
                title="Share Itinerary"
                style={{ padding: '4px 6px', color: '#38bdf8' }}
              >
                <Share2 size={14} />
              </button>

              <button
                onClick={handleDeleteClick}
                className={`btn btn-icon btn-sm ${confirmingDelete ? 'btn-danger' : 'btn-ghost'}`}
                title={confirmingDelete ? 'Click again to confirm deletion' : 'Delete Trip'}
                style={{ padding: '4px 6px', fontSize: '0.75rem' }}
              >
                <Trash2 size={14} color={confirmingDelete ? '#fca5a5' : 'var(--text-dim)'} />
                {confirmingDelete && <span style={{ marginLeft: '4px' }}>Confirm?</span>}
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.3 }}>
            {trip.title}
          </h3>

          {/* Description */}
          {trip.description && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
              {trip.description}
            </p>
          )}

          {/* Multi-City Sequential Route Trail */}
          {stops.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '5px',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                marginBottom: '1rem'
              }}
            >
              <MapPin size={13} color="#38bdf8" style={{ flexShrink: 0 }} />
              {stops.map((stop, idx) => (
                <React.Fragment key={stop.id || idx}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: idx === 0 ? '#38bdf8' : idx === stops.length - 1 ? '#a855f7' : '#f8fafc'
                    }}
                  >
                    {stop.cityName}
                  </span>
                  {idx < stops.length - 1 && (
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Footer info & CTA */}
        <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
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
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                {stops.length} {stops.length === 1 ? 'stop' : 'stops'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: stops.length > 0 ? '1fr 1.3fr' : '1fr', gap: '0.5rem' }}>
            {stops.length > 0 && (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', gap: '4px' }}
                title="Open visual route timeline preview"
              >
                <Eye size={13} />
                <span>Timeline</span>
              </button>
            )}

            <button
              onClick={() => onOpenTrip(trip.id)}
              className="btn btn-primary btn-sm"
              style={{ justifyContent: 'center', gap: '4px', fontSize: '0.8rem' }}
            >
              <span>Manage Trip</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Preview Modal */}
      <SequentialTimelinePreview
        trip={trip}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onOpenFullTrip={onOpenTrip}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        trip={trip}
        onOpenPublicView={() => {
          setIsShareOpen(false);
          window.location.hash = `#share/${trip.shareToken || trip.id}`;
        }}
      />
    </>
  );
}

