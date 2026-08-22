import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, DollarSign, Calendar, Tag } from 'lucide-react';

const CATEGORIES = [
  { value: 'Sightseeing', label: 'Sightseeing' },
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Stay', label: 'Stay / Lodging' },
  { value: 'Transport', label: 'Transit / Travel' },
  { value: 'Activity', label: 'Tour & Activity' },
  { value: 'Other', label: 'Other' }
];

export function ActivityModal({ isOpen, onClose, onSave, initialData, defaultDate }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sightseeing');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [cost, setCost] = useState(0);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Sightseeing');
      setDate(initialData.date || defaultDate || '');
      setTime(initialData.time || '10:00');
      setCost(initialData.cost || 0);
      setNotes(initialData.notes || '');
      setIsCompleted(Boolean(initialData.isCompleted));
    } else {
      setTitle('');
      setCategory('Sightseeing');
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
      setTime('10:00');
      setCost(0);
      setNotes('');
      setIsCompleted(false);
    }
  }, [initialData, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onSave({
      title,
      category,
      date,
      time,
      cost: Number(cost) || 0,
      notes,
      isCompleted
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#a855f7" />
            <h3 style={{ fontSize: '1.15rem' }}>
              {initialData ? 'Edit Activity' : 'Add Activity'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Activity Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fushimi Inari Torii Gates Hike"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Cost</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Scheduled Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scheduled Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Tips / Ticket Link</label>
              <textarea
                rows={2}
                placeholder="e.g. Booked online, enter via North Gate, bring comfortable shoes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
              />
            </div>

            {initialData && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="actCompleted"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-teal)' }}
                />
                <label htmlFor="actCompleted" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Mark as completed
                </label>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update Activity' : 'Add to Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
