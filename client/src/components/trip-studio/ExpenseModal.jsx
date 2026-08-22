import React, { useState } from 'react';
import { X, DollarSign, Tag, Calendar, MapPin } from 'lucide-react';

const CATEGORIES = [
  { value: 'Stay', label: 'Stay / Lodging' },
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Sightseeing', label: 'Sightseeing' },
  { value: 'Transport', label: 'Transit / Flights' },
  { value: 'Activity', label: 'Tours & Experiences' },
  { value: 'Other', label: 'Miscellaneous' }
];

export function ExpenseModal({ isOpen, onClose, onSave, stops = [] }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [tripStopId, setTripStopId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('Self');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onSave({
      title,
      amount: Number(amount),
      category,
      tripStopId: tripStopId || null,
      date,
      paidBy
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.15rem' }}>Log New Expense</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Expense Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Shinkansen tickets, Hotel deposit, Dinner..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Amount *</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                />
              </div>

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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Linked Destination (Optional)</label>
                <select
                  value={tripStopId}
                  onChange={(e) => setTripStopId(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- General Trip Expense --</option>
                  {stops.map(s => (
                    <option key={s.id} value={s.id}>{s.cityName}, {s.country}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Paid By</label>
              <input
                type="text"
                placeholder="Self, Shared, Alex..."
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
