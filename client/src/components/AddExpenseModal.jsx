import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  Calendar,
  CreditCard,
  Tag,
  MapPin,
  FileText,
  Plus,
  Edit3,
  Sparkles
} from 'lucide-react';
import { EXPENSE_CATEGORIES } from './CategoryBreakdownChart';

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Digital / Apple Pay',
  'Bank Transfer'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];

export function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  stops = [],
  defaultCurrency = 'USD'
}) {
  const [category, setCategory] = useState('Food & Dining');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cityStopId, setCityStopId] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category || 'Food & Dining');
      setAmount(initialData.amount || '');
      setCurrency(initialData.currency || defaultCurrency);
      setNote(initialData.note || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(initialData.paymentMethod || 'Credit Card');
      setCityStopId(initialData.cityStopId || '');
    } else {
      setCategory('Food & Dining');
      setAmount('');
      setCurrency(defaultCurrency);
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Credit Card');
      setCityStopId(stops.length > 0 ? stops[0].id : '');
    }
  }, [initialData, defaultCurrency, isOpen, stops]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onSave({
      category,
      amount: parsedAmount,
      currency,
      note: note.trim(),
      date,
      paymentMethod,
      cityStopId: cityStopId || null
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1150 }}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '95%',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(24, 33, 56, 0.95))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.2))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}
            >
              {initialData ? <Edit3 size={18} /> : <DollarSign size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                {initialData ? 'Edit Expense Record' : 'Log New Travel Expense'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Real-time tracking for trip budget and live aggregate overview
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Amount & Currency */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Expense Amount *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}
                    autoFocus
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
                  {CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category & Payment Method */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  {Object.keys(EXPENSE_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-select"
                >
                  {PAYMENT_METHODS.map(pm => (
                    <option key={pm} value={pm}>{pm}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & City Stop Association */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Date of Expense</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Associated Stop / City</label>
                <select
                  value={cityStopId}
                  onChange={(e) => setCityStopId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Trip-Wide / General</option>
                  {stops.map((stop, idx) => (
                    <option key={stop.id || idx} value={stop.id}>
                      {stop.cityName} ({stop.country || 'Destination'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description / Note */}
            <div className="form-group">
              <label className="form-label">Description / Merchant / Receipt Note *</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Traditional Kaiseki multi-course dinner with sake pairing"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={15} />
              <span>{initialData ? 'Save Changes' : 'Record Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
