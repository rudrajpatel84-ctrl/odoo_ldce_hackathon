import React from 'react';
import { ArrowLeft, Calendar, DollarSign, Share2, Copy, MapPin, Sparkles, AlertTriangle } from 'lucide-react';
import { budgetService } from '../../services/budgetService';

export function TripStudioHeader({ trip, onBack, onShare, onCopy }) {
  const budget = budgetService.calculateTripBudget(trip);
  const stops = trip.stops || [];

  const formatDateRange = () => {
    if (!trip.startDate) return 'Dates TBD';
    const s = new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!trip.endDate) return s;
    const e = new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} – ${e}`;
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: '#0f172a',
        border: '1px solid var(--border-card)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '1.5rem'
      }}
    >
      {/* Background Cover Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${trip.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          filter: 'blur(3px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.98) 100%)'
        }}
      />

      <div style={{ position: 'relative', padding: '1.5rem', zIndex: 2 }}>
        {/* Top bar: Back button & Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onShare(trip)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--accent-cyan)' }}
            >
              <Share2 size={15} color="#38bdf8" />
              <span>Share Itinerary</span>
            </button>
            <button
              onClick={() => onCopy(trip.id)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Copy size={15} />
              <span>Duplicate</span>
            </button>
          </div>
        </div>

        {/* Title, Dates & Budget Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
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
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}
              >
                <MapPin size={12} />
                {stops.length} {stops.length === 1 ? 'Destination' : 'Destinations'}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem', color: '#ffffff' }}>
              {trip.title}
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
              {trip.description || 'No description provided.'}
            </p>
          </div>

          {/* Live Budget Matrix Card */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.4)',
              border: budget.isOverBudget
                ? '1px solid rgba(244, 63, 94, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '240px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Trip Budget Matrix
              </span>
              {budget.isOverBudget && (
                <span style={{ fontSize: '0.7rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                  <AlertTriangle size={12} />
                  Over Budget
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: budget.isOverBudget ? '#f43f5e' : '#ffffff' }}>
                {budgetService.formatCurrency(budget.totalSpent, trip.currency)}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                / {budgetService.formatCurrency(trip.totalBudget, trip.currency)}
              </span>
            </div>
            <div className="progress-container" style={{ height: '6px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${budget.percentUsed}%`,
                  background: budget.isOverBudget ? '#f43f5e' : 'var(--gradient-brand)'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>{budget.percentUsed}% Utilized</span>
              <span>{budget.remainingBudget >= 0 ? `${budgetService.formatCurrency(budget.remainingBudget, trip.currency)} Left` : 'Exceeded'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
