import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';

export function StopModal({ isOpen, onClose, onSave, initialData }) {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [budgetAllocation, setBudgetAllocation] = useState(1000);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setCityName(initialData.cityName || '');
      setCountry(initialData.country || '');
      setArrivalDate(initialData.arrivalDate || '');
      setDepartureDate(initialData.departureDate || '');
      setBudgetAllocation(initialData.budgetAllocation || 1000);
      setNotes(initialData.notes || '');
    } else {
      setCityName('');
      setCountry('');
      setArrivalDate(new Date().toISOString().split('T')[0]);
      setDepartureDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
      setBudgetAllocation(1000);
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cityName) return;

    onSave({
      cityName,
      country,
      arrivalDate,
      departureDate,
      budgetAllocation: Number(budgetAllocation) || 0,
      notes
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.15rem' }}>
              {initialData ? 'Edit City Stop' : 'Add Destination / Stop'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City / Destination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  placeholder="e.g. Japan"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Arrival Date</label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Budget Allocation</label>
              <input
                type="number"
                min="0"
                step="50"
                value={budgetAllocation}
                onChange={(e) => setBudgetAllocation(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Logistics</label>
              <textarea
                rows={2}
                placeholder="e.g. Hotel reservation #, train station transfers..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update Stop' : 'Add Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
