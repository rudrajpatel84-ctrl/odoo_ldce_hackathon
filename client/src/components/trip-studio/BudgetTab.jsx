import React, { useState } from 'react';
import { Plus, DollarSign, PieChart, TrendingUp, AlertTriangle, Trash2, Tag, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { budgetService } from '../../services/budgetService';
import { CategoryBadge } from '../common/Badge';

export function BudgetTab({ trip, onOpenAddExpense, onDeleteExpense }) {
  const budget = budgetService.calculateTripBudget(trip);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const expenses = trip.expenses || [];

  const filteredExpenses = filterCategory === 'ALL'
    ? expenses
    : expenses.filter(e => (e.category || 'Other').toLowerCase() === filterCategory.toLowerCase());

  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'stay': return '#6366f1';
      case 'food': return '#f59e0b';
      case 'sightseeing': return '#38bdf8';
      case 'transport': return '#14b8a6';
      case 'activity': return '#a855f7';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Log Action */}
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
          <h2 style={{ fontSize: '1.35rem', marginBottom: '2px' }}>Budget & Expense Tracker</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time financial analytics, category distributions, and expenses ledger.
          </p>
        </div>

        <button onClick={onOpenAddExpense} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Over Budget Alert */}
      {budget.isOverBudget && (
        <div
          className="animate-fade-in"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <AlertTriangle size={22} color="#f43f5e" />
          <div>
            <div style={{ fontWeight: 700, color: '#fca5a5', fontSize: '0.925rem' }}>
              Budget Exceeded by {budgetService.formatCurrency(Math.abs(budget.remainingBudget), trip.currency)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Current expenses have surpassed your initial target of {budgetService.formatCurrency(trip.totalBudget, trip.currency)}.
            </p>
          </div>
        </div>
      )}

      {/* 4 Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}
      >
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Total Allocated Target
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            {budgetService.formatCurrency(trip.totalBudget, trip.currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Planned cap
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Total Expenses Logged
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: budget.isOverBudget ? '#f43f5e' : '#38bdf8' }}>
            {budgetService.formatCurrency(budget.totalSpent, trip.currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {budget.percentUsed}% of total budget
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Remaining Funds
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: budget.remainingBudget >= 0 ? '#10b981' : '#f43f5e' }}>
            {budgetService.formatCurrency(budget.remainingBudget, trip.currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {budget.remainingBudget >= 0 ? 'Within budget parameters' : 'Over limit'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Activity Count
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>
            {expenses.length} Entries
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Tracked items
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Category Distribution + City Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Category Breakdown Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="#38bdf8" />
            <span>Category Spending Distribution</span>
          </h3>

          {budget.categoryBreakdown.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {budget.categoryBreakdown.map((cat) => (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.category}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {budgetService.formatCurrency(cat.amount, trip.currency)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="progress-container" style={{ height: '6px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        background: getCategoryColor(cat.category)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              No categorized expenses logged yet.
            </p>
          )}
        </div>

        {/* City Spending Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#14b8a6" />
            <span>City Destination Allocations</span>
          </h3>

          {budget.cityBreakdown.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {budget.cityBreakdown.map((city) => (
                <div key={city.stopId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{city.cityName}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {budgetService.formatCurrency(city.spent, trip.currency)} / {budgetService.formatCurrency(city.allocated, trip.currency)}
                    </span>
                  </div>
                  <div className="progress-container" style={{ height: '6px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(city.percentOfAllocation, 100)}%`,
                        background: city.spent > city.allocated ? '#f43f5e' : '#14b8a6'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              No city stops created yet.
            </p>
          )}
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem'
          }}
        >
          <h3 style={{ fontSize: '1.1rem' }}>Expenses Ledger ({filteredExpenses.length})</h3>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'Stay', 'Food', 'Sightseeing', 'Transport', 'Activity', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterCategory === cat ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)',
                  color: filterCategory === cat ? '#0f172a' : 'var(--text-muted)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredExpenses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CategoryBadge category={exp.category} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                      {exp.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', gap: '8px' }}>
                      <span>{exp.date}</span>
                      {exp.paidBy && <span>• Paid by {exp.paidBy}</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    {budgetService.formatCurrency(exp.amount, trip.currency)}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(trip.id, exp.id)}
                    className="btn btn-ghost btn-icon"
                    title="Delete Expense"
                    style={{ padding: '4px', color: '#fca5a5' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No expenses found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
