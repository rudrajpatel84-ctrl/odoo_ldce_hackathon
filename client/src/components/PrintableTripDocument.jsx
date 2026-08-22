import React from 'react';
import {
  Compass,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  CircleDot,
  Building,
  Plane,
  Utensils,
  Sparkles,
  ShoppingBag,
  Tag,
  CreditCard
} from 'lucide-react';
import { CATEGORY_CONFIG } from './ActivityCard';
import { EXPENSE_CATEGORIES } from './CategoryBreakdownChart';

export function PrintableTripDocument({ trip }) {
  if (!trip) return null;

  const stops = trip.stops || [];
  const expenses = trip.expenses || [];

  const formatDateRange = () => {
    if (!trip.startDate) return 'Dates TBD';
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (isNaN(start.getTime())) return 'Dates TBD';
    const s = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (isNaN(end.getTime())) return s;
    const e = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} – ${e}`;
  };

  const formatCurrency = (amount, currency = trip.currency || 'USD') => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥' };
    const sym = symbols[currency] || '$';
    return `${sym}${Number(amount || 0).toLocaleString()}`;
  };

  const totalActivitiesCount = stops.reduce((sum, s) => sum + (s.activities?.length || 0), 0);
  const totalActivityCost = stops.reduce((sum, s) => {
    return sum + (s.activities || []).reduce((actSum, a) => actSum + (Number(a.cost) || 0), 0);
  }, 0);
  const totalManualExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalCombinedSpent = totalActivityCost + totalManualExpenses;
  const remainingBudget = (Number(trip.totalBudget) || 0) - totalCombinedSpent;

  return (
    <div
      id="printable-trip-document"
      className="printable-document"
      style={{
        padding: '2.5rem',
        background: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        marginTop: '2rem'
      }}
    >
      {/* Document Header */}
      <div
        style={{
          borderBottom: '2px solid rgba(56, 189, 248, 0.3)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <Compass size={22} color="#38bdf8" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', color: '#38bdf8', textTransform: 'uppercase' }}>
              GlobeTrotter Travel Itinerary & Expense Manifest
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
            {trip.title}
          </h1>
          {trip.description && (
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              {trip.description}
            </p>
          )}
        </div>

        {/* Quick Meta Badge Box */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            minWidth: '220px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#38bdf8' }}>
            <Calendar size={14} />
            <span style={{ fontWeight: 600 }}>{formatDateRange()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#34d399' }}>
            <DollarSign size={14} />
            <span style={{ fontWeight: 600 }}>Budget: {formatCurrency(trip.totalBudget, trip.currency)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#c084fc' }}>
            <MapPin size={14} />
            <span style={{ fontWeight: 600 }}>{stops.length} Destination Cities</span>
          </div>
        </div>
      </div>

      {/* Financial Overview Summary Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={18} color="#34d399" />
          <span>Financial & Expense Summary</span>
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            borderRadius: '10px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Budget</span>
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff', margin: '2px 0 0 0', fontWeight: 700 }}>
              {formatCurrency(trip.totalBudget, trip.currency)}
            </h4>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Realized Spend</span>
            <h4 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: '2px 0 0 0', fontWeight: 700 }}>
              {formatCurrency(totalCombinedSpent, trip.currency)}
            </h4>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Remaining Balance</span>
            <h4 style={{ fontSize: '1.2rem', color: remainingBudget >= 0 ? '#34d399' : '#ef4444', margin: '2px 0 0 0', fontWeight: 700 }}>
              {formatCurrency(remainingBudget, trip.currency)}
            </h4>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Activity Total</span>
            <h4 style={{ fontSize: '1.2rem', color: '#c084fc', margin: '2px 0 0 0', fontWeight: 700 }}>
              {formatCurrency(totalActivityCost, trip.currency)} ({totalActivitiesCount} acts)
            </h4>
          </div>
        </div>
      </div>

      {/* City Stops & Daily Activities Breakdown */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} color="#38bdf8" />
          <span>City Stops & Scheduled Activities</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {stops.map((stop, sIdx) => {
            const activities = stop.activities || [];
            const stopTotalCost = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

            return (
              <div
                key={stop.id || sIdx}
                className="print-stop-block"
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  pageBreakInside: 'avoid'
                }}
              >
                {/* Stop Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.78rem'
                      }}
                    >
                      {sIdx + 1}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
                      {stop.cityName} {stop.country ? `• ${stop.country}` : ''}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span>📅 {stop.arrivalDate} – {stop.departureDate}</span>
                    {stop.budgetAllocation > 0 && (
                      <span style={{ color: '#34d399', fontWeight: 600 }}>
                        Stop Budget: {formatCurrency(stop.budgetAllocation, trip.currency)}
                      </span>
                    )}
                  </div>
                </div>

                {stop.notes && (
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1rem 0', fontStyle: 'italic' }}>
                    💡 Notes: {stop.notes}
                  </p>
                )}

                {/* Activities Table */}
                {activities.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#94a3b8' }}>
                          <th style={{ padding: '6px 8px' }}>Activity</th>
                          <th style={{ padding: '6px 8px' }}>Category</th>
                          <th style={{ padding: '6px 8px' }}>Time Slot</th>
                          <th style={{ padding: '6px 8px' }}>Duration</th>
                          <th style={{ padding: '6px 8px' }}>Cost</th>
                          <th style={{ padding: '6px 8px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((act, aIdx) => {
                          const catMeta = CATEGORY_CONFIG[act.category] || { color: '#94a3b8' };
                          return (
                            <tr key={act.id || aIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                              <td style={{ padding: '8px', fontWeight: 600, color: '#ffffff' }}>
                                {act.title}
                                {act.locationNotes && (
                                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 400 }}>
                                    {act.locationNotes}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '8px', color: catMeta.color, fontWeight: 600 }}>
                                {act.category}
                              </td>
                              <td style={{ padding: '8px', color: '#cbd5e1' }}>{act.timeSlot || 'Anytime'}</td>
                              <td style={{ padding: '8px', color: '#cbd5e1' }}>{act.durationHours} hrs</td>
                              <td style={{ padding: '8px', fontWeight: 700, color: act.cost > 0 ? '#38bdf8' : '#34d399' }}>
                                {act.cost > 0 ? formatCurrency(act.cost, trip.currency) : 'Free'}
                              </td>
                              <td style={{ padding: '8px' }}>
                                <span style={{ color: act.isBooked ? '#34d399' : '#94a3b8', fontWeight: 600 }}>
                                  {act.isBooked ? '✓ Booked' : '○ Planned'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>No activities scheduled for this stop.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Logged Expenses Manifest */}
      {expenses.length > 0 && (
        <div style={{ pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="#34d399" />
            <span>Logged Receipts & Travel Expenses</span>
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '6px 8px' }}>Date</th>
                <th style={{ padding: '6px 8px' }}>Description / Merchant</th>
                <th style={{ padding: '6px 8px' }}>Category</th>
                <th style={{ padding: '6px 8px' }}>Payment</th>
                <th style={{ padding: '6px 8px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, eIdx) => {
                const catMeta = EXPENSE_CATEGORIES[exp.category] || { color: '#94a3b8' };
                return (
                  <tr key={exp.id || eIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '8px', color: '#94a3b8' }}>{exp.date}</td>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#ffffff' }}>{exp.note || exp.category}</td>
                    <td style={{ padding: '8px', color: catMeta.color, fontWeight: 600 }}>{exp.category}</td>
                    <td style={{ padding: '8px', color: '#cbd5e1' }}>{exp.paymentMethod}</td>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#38bdf8' }}>
                      {formatCurrency(exp.amount, exp.currency || trip.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Branding */}
      <div
        style={{
          marginTop: '2.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#64748b'
        }}
      >
        <span>Generated by GlobeTrotter Travel Studio • Offline Cache & Export Verified</span>
        <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  );
}
