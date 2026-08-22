import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Clock, DollarSign, Edit2, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';
import { budgetService } from '../../services/budgetService';

export function ItineraryTab({
  trip,
  onOpenAddStop,
  onEditStop,
  onDeleteStop,
  onOpenAddActivity,
  onEditActivity,
  onToggleActivity,
  onDeleteActivity
}) {
  const stops = trip.stops || [];
  const [collapsedStops, setCollapsedStops] = useState({});

  const toggleCollapse = (stopId) => {
    setCollapsedStops(prev => ({ ...prev, [stopId]: !prev[stopId] }));
  };

  const formatDateRange = (arr, dep) => {
    if (!arr) return 'Dates TBD';
    const a = new Date(arr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!dep) return a;
    const d = new Date(dep).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `${a} – ${d}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top action bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '2px' }}>Multi-City Itinerary</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Organize destinations and schedule daily activities with estimated costs.
          </p>
        </div>

        <button onClick={onOpenAddStop} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add Destination Stop</span>
        </button>
      </div>

      {/* Stops List */}
      {stops.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {stops.map((stop, index) => {
            const isCollapsed = collapsedStops[stop.id];
            const activities = stop.activities || [];
            const stopCostSum = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

            return (
              <div
                key={stop.id}
                className="glass-card animate-fade-in"
                style={{ padding: '0', overflow: 'hidden' }}
              >
                {/* Stop Card Header */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderBottom: isCollapsed ? 'none' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleCollapse(stop.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Sequence Badge */}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                          {stop.cityName}
                        </h3>
                        {stop.country && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            • {stop.country}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} color="#38bdf8" />
                          {formatDateRange(stop.arrivalDate, stop.departureDate)}
                        </span>
                        <span>•</span>
                        <span>{activities.length} {activities.length === 1 ? 'activity' : 'activities'}</span>
                        <span>•</span>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>
                          {budgetService.formatCurrency(stopCostSum, trip.currency)} est.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenAddActivity(stop.id, stop.arrivalDate)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Activity</span>
                    </button>
                    <button
                      onClick={() => onEditStop(stop)}
                      className="btn btn-secondary btn-icon"
                      title="Edit Stop"
                      style={{ padding: '6px' }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteStop(trip.id, stop.id)}
                      className="btn btn-danger btn-icon"
                      title="Delete Stop"
                      style={{ padding: '6px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => toggleCollapse(stop.id)}
                      className="btn btn-ghost btn-icon"
                      style={{ padding: '6px' }}
                    >
                      {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                  </div>
                </div>

                {/* Stop Content: Notes & Activities */}
                {!isCollapsed && (
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    {stop.notes && (
                      <div
                        style={{
                          padding: '0.65rem 0.9rem',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          fontSize: '0.825rem',
                          color: 'var(--text-muted)',
                          marginBottom: '1rem'
                        }}
                      >
                        💡 <strong style={{ color: 'var(--text-main)' }}>Notes:</strong> {stop.notes}
                      </div>
                    )}

                    {/* Activities List */}
                    {activities.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {activities.map((act) => (
                          <div
                            key={act.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.85rem 1rem',
                              borderRadius: 'var(--radius-md)',
                              background: act.isCompleted ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.07)',
                              transition: 'all 0.2s ease',
                              opacity: act.isCompleted ? 0.75 : 1
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                              {/* Completion Toggle */}
                              <button
                                onClick={() => onToggleActivity(trip.id, stop.id, act.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: act.isCompleted ? 'var(--accent-teal)' : 'var(--text-dim)',
                                  display: 'flex'
                                }}
                              >
                                {act.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                              </button>

                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span
                                    style={{
                                      fontSize: '0.925rem',
                                      fontWeight: 600,
                                      color: act.isCompleted ? 'var(--text-muted)' : '#f8fafc',
                                      textDecoration: act.isCompleted ? 'line-through' : 'none'
                                    }}
                                  >
                                    {act.title}
                                  </span>
                                  <CategoryBadge category={act.category} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                                  {act.date && (
                                    <span>
                                      {new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                  )}
                                  {act.time && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <Clock size={11} /> {act.time}
                                    </span>
                                  )}
                                  {act.notes && <span>• {act.notes}</span>}
                                </div>
                              </div>
                            </div>

                            {/* Cost & Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {act.cost > 0 && (
                                <span
                                  style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: '#f8fafc',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(255, 255, 255, 0.06)'
                                  }}
                                >
                                  {budgetService.formatCurrency(act.cost, trip.currency)}
                                </span>
                              )}

                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => onEditActivity(stop.id, act)}
                                  className="btn btn-ghost btn-icon"
                                  title="Edit Activity"
                                  style={{ padding: '4px' }}
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => onDeleteActivity(trip.id, stop.id, act.id)}
                                  className="btn btn-ghost btn-icon"
                                  title="Delete Activity"
                                  style={{ padding: '4px', color: '#fca5a5' }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1.75rem',
                          borderRadius: '8px',
                          border: '1px dashed rgba(255, 255, 255, 0.1)',
                          background: 'rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          No activities planned for {stop.cityName} yet.
                        </p>
                        <button
                          onClick={() => onOpenAddActivity(stop.id, stop.arrivalDate)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Plus size={14} />
                          <span>Add First Activity</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
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
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>No Destination Stops Added</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
              Add your first city or region to start building out your itinerary and daily schedule.
            </p>
          </div>
          <button onClick={onOpenAddStop} className="btn btn-primary">
            <Plus size={16} />
            <span>Add First Stop</span>
          </button>
        </div>
      )}
    </div>
  );
}
