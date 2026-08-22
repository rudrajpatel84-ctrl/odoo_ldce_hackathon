import React, { useState } from 'react';
import { X, Compass, Calendar, DollarSign, AlertCircle, Sparkles } from 'lucide-react';
import { useTrips } from '../../context/TripContext';

export function CreateTripModal({ isOpen, onClose }) {
  const { createTrip } = useTrips();

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getDefaultEndString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getDefaultEndString());
  const [totalBudget, setTotalBudget] = useState('2500');
  const [currency, setCurrency] = useState('USD');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      return 'Please enter a trip title.';
    }
    if (!startDate) {
      return 'Please select a start date.';
    }
    if (!endDate) {
      return 'Please select an end date.';
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Please enter valid start and end dates.';
    }
    if (end < start) {
      return 'End date cannot be earlier than start date.';
    }
    const budgetNum = Number(totalBudget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      return 'Target budget cannot be negative.';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validationMsg = validate();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      createTrip({
        title,
        description,
        startDate,
        endDate,
        totalBudget: Number(totalBudget) || 0,
        currency
      });
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate(getTodayString());
      setEndDate(getDefaultEndString());
      setTotalBudget('2500');
      setCurrency('USD');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.15rem' }}>Plan a New Journey</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-error">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Trip Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Japan Autumn Excursion 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Purpose (Optional)</label>
              <textarea
                rows={2}
                placeholder="Briefly describe what this journey is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Dates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Budget & Currency Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Budget</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="2500"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
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
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Creating...' : 'Create Trip'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
