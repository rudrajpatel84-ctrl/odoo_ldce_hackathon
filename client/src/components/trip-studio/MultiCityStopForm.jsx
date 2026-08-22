import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, MapPin, Calendar, FileText, Sparkles, Navigation } from 'lucide-react';

export const ROUTE_PRESETS = [
  {
    name: 'Japan Golden Route',
    stops: [
      { cityName: 'Tokyo', country: 'Japan', days: 4, notes: 'Shinjuku, Shibuya & teamLab' },
      { cityName: 'Kyoto', country: 'Japan', days: 3, notes: 'Gion district & Fushimi Inari' },
      { cityName: 'Osaka', country: 'Japan', days: 3, notes: 'Dotonbori street food & Osaka Castle' }
    ]
  },
  {
    name: 'Italian Renaissance',
    stops: [
      { cityName: 'Rome', country: 'Italy', days: 4, notes: 'Colosseum, Vatican & Trastevere' },
      { cityName: 'Florence', country: 'Italy', days: 3, notes: 'Uffizi Gallery & Tuscan Day Trip' },
      { cityName: 'Venice', country: 'Italy', days: 2, notes: 'Grand Canal & St. Mark’s Square' }
    ]
  },
  {
    name: 'European Grand Capitals',
    stops: [
      { cityName: 'Paris', country: 'France', days: 4, notes: 'Louvre, Eiffel Tower & Montmartre' },
      { cityName: 'Brussels', country: 'Belgium', days: 2, notes: 'Grand Place & Belgian chocolate tasting' },
      { cityName: 'Amsterdam', country: 'Netherlands', days: 3, notes: 'Canal cruises & Rijksmuseum' }
    ]
  }
];

export function MultiCityStopForm({
  stops,
  onChangeStops,
  baseStartDate,
  onDatesCalculated
}) {
  const calculateDuration = (arrival, departure) => {
    if (!arrival || !departure) return null;
    const a = new Date(arrival);
    const d = new Date(departure);
    if (isNaN(a.getTime()) || isNaN(d.getTime())) return null;
    const diff = Math.ceil((d - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const handleAddStop = () => {
    let nextArrival = baseStartDate || new Date().toISOString().split('T')[0];
    if (stops.length > 0) {
      const lastStop = stops[stops.length - 1];
      if (lastStop.departureDate) {
        nextArrival = lastStop.departureDate;
      }
    }

    const arrDate = new Date(nextArrival);
    const depDate = new Date(arrDate.getTime() + 3 * 86400000);

    const newStop = {
      id: `stop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cityName: '',
      country: '',
      arrivalDate: nextArrival,
      departureDate: depDate.toISOString().split('T')[0],
      notes: '',
      budgetAllocation: 500
    };

    const updated = [...stops, newStop];
    onChangeStops(updated);
  };

  const handleUpdateStop = (index, field, value) => {
    const updated = stops.map((stop, i) => {
      if (i !== index) return stop;
      return { ...stop, [field]: value };
    });
    onChangeStops(updated);
  };

  const handleRemoveStop = (index) => {
    const updated = stops.filter((_, i) => i !== index);
    onChangeStops(updated);
  };

  const handleMoveStop = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stops.length - 1) return;

    const updated = [...stops];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    onChangeStops(updated);
  };

  const handleApplyPreset = (preset) => {
    const start = baseStartDate ? new Date(baseStartDate) : new Date();
    let currentCursor = new Date(start);

    const generated = preset.stops.map((s, idx) => {
      const arrival = new Date(currentCursor);
      const departure = new Date(currentCursor.getTime() + (s.days || 3) * 86400000);
      currentCursor = new Date(departure);

      return {
        id: `stop-preset-${Date.now()}-${idx}`,
        cityName: s.cityName,
        country: s.country,
        arrivalDate: arrival.toISOString().split('T')[0],
        departureDate: departure.toISOString().split('T')[0],
        notes: s.notes || '',
        budgetAllocation: 800
      };
    });

    onChangeStops(generated);

    if (onDatesCalculated && generated.length > 0) {
      onDatesCalculated(
        generated[0].arrivalDate,
        generated[generated.length - 1].departureDate
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header & Preset Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <label className="form-label" style={{ fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="#38bdf8" />
            <span>Multi-City Stops & Route Sequence ({stops.length})</span>
          </label>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Add and arrange intermediate destinations in sequential travel order.
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddStop}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
        >
          <Plus size={14} />
          <span>Add City Stop</span>
        </button>
      </div>

      {/* Route Presets Pill Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} color="#a855f7" />
          <span>Quick Presets:</span>
        </span>
        {ROUTE_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleApplyPreset(preset)}
            style={{
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-muted)',
              fontSize: '0.74rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#38bdf8';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Stops List */}
      {stops.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {stops.map((stop, index) => {
            const duration = calculateDuration(stop.arrivalDate, stop.departureDate);
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;

            return (
              <div
                key={stop.id || index}
                style={{
                  position: 'relative',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                {/* Top Row: Sequence Badge, City/Country Inputs, Reorder & Remove Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                    {/* Sequence Badge */}
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25))',
                        border: '1px solid #38bdf8',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </div>

                    <input
                      type="text"
                      placeholder="City Name (e.g. Kyoto) *"
                      required
                      value={stop.cityName}
                      onChange={(e) => handleUpdateStop(index, 'cityName', e.target.value)}
                      className="form-input"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.88rem', fontWeight: 600, flex: 2 }}
                    />

                    <input
                      type="text"
                      placeholder="Country (e.g. Japan)"
                      value={stop.country || ''}
                      onChange={(e) => handleUpdateStop(index, 'country', e.target.value)}
                      className="form-input"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', flex: 1 }}
                    />
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {duration && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.12)',
                          padding: '3px 7px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600,
                          marginRight: '4px'
                        }}
                      >
                        {duration} {duration === 1 ? 'day' : 'days'}
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveStop(index, 'up')}
                      className="btn btn-ghost btn-icon"
                      title="Move Stop Up"
                      style={{
                        padding: '4px',
                        opacity: isFirst ? 0.3 : 1,
                        cursor: isFirst ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveStop(index, 'down')}
                      className="btn btn-ghost btn-icon"
                      title="Move Stop Down"
                      style={{
                        padding: '4px',
                        opacity: isLast ? 0.3 : 1,
                        cursor: isLast ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveStop(index)}
                      className="btn btn-ghost btn-icon"
                      title="Remove Stop"
                      style={{ padding: '4px', color: '#fca5a5' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Dates & Logistics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '2px', display: 'block' }}>
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={stop.arrivalDate || ''}
                      onChange={(e) => handleUpdateStop(index, 'arrivalDate', e.target.value)}
                      className="form-input"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '2px', display: 'block' }}>
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={stop.departureDate || ''}
                      onChange={(e) => handleUpdateStop(index, 'departureDate', e.target.value)}
                      className="form-input"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '2px', display: 'block' }}>
                      Stay Notes & Logistics (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hotel Gracery, Shinkansen transfer..."
                      value={stop.notes || ''}
                      onChange={(e) => handleUpdateStop(index, 'notes', e.target.value)}
                      className="form-input"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
            No intermediate stops added yet. Click "+ Add City Stop" or choose a Quick Preset above.
          </p>
          <button
            type="button"
            onClick={handleAddStop}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} />
            <span>Add First Stop</span>
          </button>
        </div>
      )}
    </div>
  );
}
