import React from 'react';
import { X, MapPin, Calendar, Clock, ArrowRight, Sparkles, Navigation, DollarSign, CheckCircle2 } from 'lucide-react';

export function SequentialTimelinePreview({ trip, isOpen, onClose, onOpenFullTrip }) {
  if (!isOpen || !trip) return null;

  const stops = trip.stops || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const calculateStayDays = (arr, dep) => {
    if (!arr || !dep) return null;
    const a = new Date(arr);
    const d = new Date(dep);
    if (isNaN(a.getTime()) || isNaN(d.getTime())) return null;
    const diff = Math.ceil((d - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ position: 'relative', overflow: 'hidden' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontWeight: 600
                }}
              >
                INTERACTIVE ROUTE TIMELINE
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                • {stops.length} {stops.length === 1 ? 'Stop' : 'Stops'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              {trip.title}
            </h3>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {stops.length > 0 ? (
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
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
                  const isLast = index === stops.length - 1;
                  const nextStop = !isLast ? stops[index + 1] : null;

                  return (
                    <div
                      key={stop.id || index}
                      className="animate-fade-in"
                      style={{ position: 'relative' }}
                    >
                      {/* Timeline Node Icon Pin */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '4px',
                          transform: 'translateX(-50%)',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                          border: '2px solid #ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 14px rgba(56, 189, 248, 0.8)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          zIndex: 2
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* Stop Info Card */}
                      <div
                        className="glass-card"
                        style={{
                          padding: '1.15rem 1.25rem',
                          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.75))',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '0.4rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
                                {stop.cityName}
                              </h4>
                              {stop.country && (
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  • {stop.country}
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                                <Calendar size={13} />
                                {formatDate(stop.arrivalDate)} – {formatDate(stop.departureDate)}
                              </span>
                              {stayDays && (
                                <>
                                  <span>•</span>
                                  <span style={{ color: '#10b981', fontWeight: 600 }}>
                                    {stayDays} {stayDays === 1 ? 'day stay' : 'days stay'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stop Notes */}
                        {stop.notes && (
                          <div
                            style={{
                              marginTop: '0.65rem',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)'
                            }}
                          >
                            💡 <strong style={{ color: 'var(--text-main)' }}>Notes:</strong> {stop.notes}
                          </div>
                        )}

                        {/* Activities list if present */}
                        {stop.activities && stop.activities.length > 0 && (
                          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                              Planned Highlights ({stop.activities.length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {stop.activities.map((act) => (
                                <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#f8fafc' }}>
                                  <span style={{ color: '#38bdf8' }}>•</span>
                                  <span>{act.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Transit Leg Indicator to Next City */}
                      {nextStop && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            margin: '0.5rem 0 0 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(99, 102, 241, 0.12)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            fontSize: '0.74rem',
                            color: '#a5b4fc',
                            fontWeight: 500
                          }}
                        >
                          <Navigation size={11} style={{ transform: 'rotate(90deg)' }} />
                          <span>Transit to <strong>{nextStop.cityName}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: 'var(--text-muted)' }}>
              <p>No multi-city route stops have been added yet.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost">
            Close Preview
          </button>
          {onOpenFullTrip && (
            <button
              onClick={() => {
                onClose();
                onOpenFullTrip(trip.id);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Manage Trip Itinerary</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
