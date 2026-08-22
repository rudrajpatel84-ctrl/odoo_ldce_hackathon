import React, { useState } from 'react';
import { X, Sparkles, Compass, Calendar, DollarSign, Image as ImageIcon } from 'lucide-react';
import { TEMPLATE_TRIPS } from '../../services/mockData';

const COVER_PRESETS = [
  { label: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Italian Riviera', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Iceland Aurora', url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Bali Tropical', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Swiss Alps', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80' }
];

export function NewTripModal({ isOpen, onClose, onCreateTrip }) {
  const [activeMode, setActiveMode] = useState('custom'); // 'custom' | 'template'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState(2500);
  const [currency, setCurrency] = useState('USD');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onCreateTrip({
      title,
      description,
      coverImage,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      totalBudget: Number(totalBudget) || 0,
      currency,
      stops: [],
      expenses: []
    });

    onClose();
  };

  const handleApplyTemplate = (tpl) => {
    const start = new Date();
    const end = new Date(start.getTime() + (tpl.durationDays || 7) * 86400000);

    const generatedStops = tpl.stops.map((s, idx) => {
      const stopStart = new Date(start.getTime() + idx * 2 * 86400000);
      const stopEnd = new Date(stopStart.getTime() + (s.days || 2) * 86400000);
      return {
        id: `stop-tpl-${Date.now()}-${idx}`,
        cityName: s.cityName,
        country: s.country,
        arrivalDate: stopStart.toISOString().split('T')[0],
        departureDate: stopEnd.toISOString().split('T')[0],
        orderIndex: idx,
        budgetAllocation: s.budgetAllocation || 1000,
        notes: `Pre-configured route stop in ${s.cityName}.`,
        activities: [
          {
            id: `act-tpl-${Date.now()}-${idx}-1`,
            title: `Explore ${s.cityName} City Center & Highlights`,
            category: 'Sightseeing',
            date: stopStart.toISOString().split('T')[0],
            time: '10:00',
            cost: 45,
            notes: 'Orientation walking tour',
            isCompleted: false,
            orderIndex: 0
          }
        ]
      };
    });

    onCreateTrip({
      title: tpl.title,
      description: tpl.description,
      coverImage: tpl.coverImage,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      totalBudget: tpl.totalBudget,
      currency: tpl.currency,
      stops: generatedStops,
      expenses: [
        {
          id: `exp-tpl-${Date.now()}`,
          title: 'Initial Accommodations & Flight Deposit',
          category: 'Stay',
          amount: Math.round(tpl.totalBudget * 0.35),
          date: start.toISOString().split('T')[0],
          paidBy: 'Self'
        }
      ]
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem' }}>Create New Journey</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            padding: '0.5rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '8px'
          }}
        >
          <button
            onClick={() => setActiveMode('custom')}
            className={`btn btn-sm ${activeMode === 'custom' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Custom Itinerary
          </button>
          <button
            onClick={() => setActiveMode('template')}
            className={`btn btn-sm ${activeMode === 'template' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Sparkles size={14} color="#38bdf8" />
            <span>Curated Starter Templates</span>
          </button>
        </div>

        <div className="modal-body">
          {activeMode === 'template' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Select an expertly planned multi-city journey to kickstart your itinerary with stops, activities, and budget targets.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
                {TEMPLATE_TRIPS.map((tpl, i) => (
                  <div
                    key={i}
                    onClick={() => handleApplyTemplate(tpl)}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                  >
                    <img
                      src={tpl.coverImage}
                      alt={tpl.title}
                      style={{
                        width: '90px',
                        height: '75px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h4 style={{ fontSize: '0.975rem', color: '#f8fafc', marginBottom: '2px' }}>{tpl.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{tpl.description}</p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                        <span>📍 {tpl.stops.length} Cities</span>
                        <span>⏱️ {tpl.durationDays} Days</span>
                        <span>💰 {tpl.currency} {tpl.totalBudget}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Trip Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., European Summer Tour 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Theme</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what this trip is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Budget & Currency */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Total Target Budget</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-select"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD (CA$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>
              </div>

              {/* Cover Presets */}
              <div className="form-group">
                <label className="form-label">Cover Photo Preset</label>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {COVER_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(p.url)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: coverImage === p.url ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: coverImage === p.url ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: coverImage === p.url ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 0 0 0', marginTop: '1rem' }}>
                <button type="button" onClick={onClose} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Launch Trip Studio
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
