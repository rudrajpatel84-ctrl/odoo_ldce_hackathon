import React from 'react';
import { MapPin, Calendar, Clock, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';
import { budgetService } from '../../services/budgetService';

export function TimelineTab({ trip }) {
  const stops = trip.stops || [];

  // Build a flat chronological list of timeline events (Stops + Activities)
  const events = [];

  stops.forEach((stop, sIdx) => {
    // Stop arrival milestone
    events.push({
      id: `event-stop-${stop.id}`,
      type: 'STOP_ARRIVAL',
      date: stop.arrivalDate || '1970-01-01',
      time: '00:00',
      title: `Arrival in ${stop.cityName}`,
      subtitle: stop.country ? `${stop.cityName}, ${stop.country}` : stop.cityName,
      notes: stop.notes,
      stopIndex: sIdx + 1
    });

    // Activities under stop
    (stop.activities || []).forEach(act => {
      events.push({
        id: `event-act-${act.id}`,
        type: 'ACTIVITY',
        date: act.date || stop.arrivalDate || '1970-01-01',
        time: act.time || '12:00',
        title: act.title,
        category: act.category,
        cost: act.cost,
        notes: act.notes,
        cityName: stop.cityName,
        isCompleted: act.isCompleted
      });
    });
  });

  // Sort chronologically by date then time
  events.sort((a, b) => {
    const dateComp = (a.date || '').localeCompare(b.date || '');
    if (dateComp !== 0) return dateComp;
    return (a.time || '').localeCompare(b.time || '');
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '2px' }}>Visual Journey Roadmap</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Chronological milestone timeline of destinations, excursions, and activities.
        </p>
      </div>

      {events.length > 0 ? (
        <div style={{ position: 'relative', paddingLeft: '28px' }}>
          {/* Vertical Glowing Line */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              bottom: '12px',
              left: '11px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--accent-cyan) 0%, var(--accent-indigo) 50%, var(--accent-purple) 100%)',
              opacity: 0.6
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {events.map((ev, idx) => {
              const isMilestone = ev.type === 'STOP_ARRIVAL';

              return (
                <div
                  key={ev.id}
                  className="animate-fade-in"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  {/* Timeline Node Icon Pin */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-28px',
                      top: '6px',
                      transform: 'translateX(-50%)',
                      width: isMilestone ? '24px' : '16px',
                      height: isMilestone ? '24px' : '16px',
                      borderRadius: '50%',
                      background: isMilestone ? 'var(--gradient-brand)' : '#0f172a',
                      border: isMilestone ? '2px solid #ffffff' : '2px solid var(--accent-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isMilestone ? '0 0 12px rgba(56, 189, 248, 0.8)' : 'none',
                      zIndex: 3
                    }}
                  >
                    {isMilestone && <MapPin size={12} color="#ffffff" />}
                  </div>

                  {/* Date & Time Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                    <span
                      style={{
                        color: isMilestone ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        fontWeight: 600
                      }}
                    >
                      {ev.date && ev.date !== '1970-01-01'
                        ? new Date(ev.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                        : 'Date TBD'}
                    </span>
                    {!isMilestone && ev.time && (
                      <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {ev.time}
                      </span>
                    )}
                  </div>

                  {/* Event Card Content */}
                  <div
                    className="glass-card"
                    style={{
                      padding: isMilestone ? '1rem 1.25rem' : '0.85rem 1rem',
                      background: isMilestone
                        ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(17, 24, 39, 0.85))'
                        : 'rgba(255, 255, 255, 0.03)',
                      borderColor: isMilestone ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: isMilestone ? '1.05rem' : '0.925rem',
                            fontWeight: 700,
                            color: '#ffffff'
                          }}
                        >
                          {ev.title}
                        </span>
                        {ev.category && <CategoryBadge category={ev.category} />}
                      </div>

                      {ev.cost > 0 && (
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                          {budgetService.formatCurrency(ev.cost, trip.currency)}
                        </span>
                      )}
                    </div>

                    {ev.notes && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {ev.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-dim)' }}>
          No timeline events yet. Add destinations and scheduled activities in the Itinerary tab to visualize your roadmap.
        </div>
      )}
    </div>
  );
}
