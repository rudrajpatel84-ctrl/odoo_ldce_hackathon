import React from 'react';
import { Compass, Calendar, MapPin, DollarSign, Copy, ArrowLeft, Clock, CheckCircle2, Globe2 } from 'lucide-react';
import { budgetService } from '../../services/budgetService';
import { CategoryBadge } from '../common/Badge';

export function PublicShareView({ trip, onCopyTrip, onNavigateHome }) {
  if (!trip) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Shared Itinerary Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          This link may have expired or been removed by the creator.
        </p>
        <button onClick={onNavigateHome} className="btn btn-primary">
          Back to GlobeTrotter
        </button>
      </div>
    );
  }

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
    <div className="app-container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Top Bar Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <button
          onClick={onNavigateHome}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>GlobeTrotter Studio</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--accent-cyan)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Globe2 size={13} />
            Public Shared Itinerary
          </span>

          <button
            onClick={() => onCopyTrip(trip.id)}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Copy size={15} />
            <span>Copy to My Trips</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase Card */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          padding: '2.5rem 2rem',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}
      >
        {/* Cover Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${trip.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.22,
            filter: 'blur(2px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontSize: '0.8rem',
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
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                fontSize: '0.8rem'
              }}
            >
              <MapPin size={13} />
              {stops.length} Destinations
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#6ee7b7',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <DollarSign size={13} />
              Est. Budget {budgetService.formatCurrency(trip.totalBudget, trip.currency)}
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '0.6rem' }}>
            {trip.title}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {trip.description}
          </p>
        </div>
      </div>

      {/* Multi-City Journey Itinerary */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MapPin size={20} color="#38bdf8" />
        <span>Destinations & Activities ({stops.length})</span>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stops.map((stop, sIdx) => (
          <div key={stop.id} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--gradient-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {sIdx + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                    {stop.cityName} {stop.country ? `• ${stop.country}` : ''}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {stop.arrivalDate} – {stop.departureDate}
                  </div>
                </div>
              </div>

              {stop.budgetAllocation > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                  Allocated: {budgetService.formatCurrency(stop.budgetAllocation, trip.currency)}
                </div>
              )}
            </div>

            {stop.notes && (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                💡 {stop.notes}
              </p>
            )}

            {/* Activities in this stop */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(stop.activities || []).map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CategoryBadge category={act.category} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', gap: '8px' }}>
                        {act.time && <span>🕒 {act.time}</span>}
                        {act.notes && <span>• {act.notes}</span>}
                      </div>
                    </div>
                  </div>

                  {act.cost > 0 && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {budgetService.formatCurrency(act.cost, trip.currency)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Action CTA */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>Inspired by this voyage?</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Copy this itinerary to your own GlobeTrotter studio to customize stops, dates, and budget.
          </p>
        </div>
        <button
          onClick={() => onCopyTrip(trip.id)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Copy size={16} />
          <span>Clone Itinerary to My Trips</span>
        </button>
      </div>
    </div>
  );
}
