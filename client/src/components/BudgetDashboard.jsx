import React, { useState, useMemo } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  Globe,
  PieChart as PieIcon,
  Sparkles,
  Flame,
  CreditCard
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { CategoryBreakdownChart, EXPENSE_CATEGORIES } from './CategoryBreakdownChart';
import { ExpenseList } from './ExpenseList';
import { AddExpenseModal } from './AddExpenseModal';

// Multi-Currency Exchange Rates relative to USD base
export const CURRENCY_CONFIG = {
  'USD': { symbol: '$', rate: 1.0, name: 'US Dollar (USD)' },
  'EUR': { symbol: '€', rate: 0.92, name: 'Euro (EUR)' },
  'GBP': { symbol: '£', rate: 0.79, name: 'British Pound (GBP)' },
  'INR': { symbol: '₹', rate: 83.5, name: 'Indian Rupee (INR)' },
  'JPY': { symbol: '¥', rate: 155.0, name: 'Japanese Yen (JPY)' }
};

export function BudgetDashboard({ trip }) {
  const { addExpense, updateExpense, deleteExpense, setTripBudget } = useTrips();

  // Multi-Currency State (defaults to trip currency or USD)
  const initialCurrency = CURRENCY_CONFIG[trip?.currency] ? trip.currency : 'USD';
  const [displayCurrency, setDisplayCurrency] = useState(initialCurrency);

  // Modals state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState(trip?.totalBudget || 0);

  if (!trip) return null;

  const expenses = trip.expenses || [];
  const stops = trip.stops || [];

  // Currency Converter Helper
  const convertAmount = (amount, fromCurrency = trip.currency || 'USD', toCurrency = displayCurrency) => {
    const num = Number(amount) || 0;
    const fromRate = CURRENCY_CONFIG[fromCurrency]?.rate || 1.0;
    const toRate = CURRENCY_CONFIG[toCurrency]?.rate || 1.0;
    const inUSD = num / fromRate;
    return Math.round(inUSD * toRate);
  };

  const currencySymbol = CURRENCY_CONFIG[displayCurrency]?.symbol || '$';

  // Aggregate Activity Expenses across all stops
  const totalActivityCostInTripCurrency = useMemo(() => {
    return stops.reduce((sum, stop) => {
      return sum + (stop.activities || []).reduce((actSum, a) => actSum + (Number(a.cost) || 0), 0);
    }, 0);
  }, [stops]);

  // Aggregate Manual Logged Expenses
  const totalManualExpensesInTripCurrency = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  }, [expenses]);

  // Total Combined Spending (Manual Expenses + Activity Costs)
  const totalSpentInTripCurrency = totalManualExpensesInTripCurrency + totalActivityCostInTripCurrency;
  const convertedTotalSpent = convertAmount(totalSpentInTripCurrency, trip.currency, displayCurrency);
  const convertedBudget = convertAmount(trip.totalBudget || 0, trip.currency, displayCurrency);
  const convertedRemaining = convertedBudget - convertedTotalSpent;

  // Budget Utilization Ratio
  const budgetUtilizationPercent = convertedBudget > 0
    ? Math.round((convertedTotalSpent / convertedBudget) * 100)
    : 0;

  // Budget Health Alert Status (Green < 75%, Yellow 75-90%, Red > 90%)
  const budgetStatus = useMemo(() => {
    if (budgetUtilizationPercent > 90) {
      return {
        level: 'red',
        label: 'Budget Alert (Over 90%)',
        subtext: 'Expenses and activity costs are exceeding safety margin.',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.35)',
        icon: AlertCircle
      };
    } else if (budgetUtilizationPercent >= 75) {
      return {
        level: 'yellow',
        label: 'Budget Caution (75% - 90%)',
        subtext: 'Approaching maximum budget threshold. Monitor upcoming activities.',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.35)',
        icon: AlertTriangle
      };
    } else {
      return {
        level: 'green',
        label: 'Budget Healthy (< 75%)',
        subtext: 'Trip spending is well within planned parameters.',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.35)',
        icon: CheckCircle2
      };
    }
  }, [budgetUtilizationPercent]);

  const StatusIcon = budgetStatus.icon;

  // Calculate Category Totals (combining manual expenses + activities categorized under Activities)
  const categoryTotals = useMemo(() => {
    const totals = {
      'Accommodation': 0,
      'Transport': 0,
      'Food & Dining': 0,
      'Activities': convertAmount(totalActivityCostInTripCurrency, trip.currency, displayCurrency),
      'Shopping': 0,
      'Misc': 0
    };

    expenses.forEach(exp => {
      const cat = totals[exp.category] !== undefined ? exp.category : 'Misc';
      const converted = convertAmount(exp.amount, exp.currency || trip.currency, displayCurrency);
      totals[cat] = (totals[cat] || 0) + converted;
    });

    return totals;
  }, [expenses, totalActivityCostInTripCurrency, trip.currency, displayCurrency]);

  // Trip duration in days
  const tripDays = useMemo(() => {
    if (!trip.startDate || !trip.endDate) return 1;
    const s = new Date(trip.startDate);
    const e = new Date(trip.endDate);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [trip.startDate, trip.endDate]);

  const dailyBurnRate = Math.round(convertedTotalSpent / tripDays);
  const dailyBudgetAllowance = Math.round(convertedBudget / tripDays);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const parsed = Number(newBudgetValue);
    if (!isNaN(parsed) && parsed >= 0) {
      setTripBudget(trip.id, parsed);
      setIsEditingBudget(false);
    }
  };

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsAddExpenseOpen(true);
  };

  const handleOpenEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsAddExpenseOpen(true);
  };

  const handleSaveExpense = (expenseData) => {
    if (editingExpense) {
      updateExpense(trip.id, editingExpense.id, expenseData);
    } else {
      addExpense(trip.id, expenseData);
    }
  };

  const handleDeleteExpense = (expenseId, label) => {
    if (window.confirm(`Delete expense record "${label}"?`)) {
      deleteExpense(trip.id, expenseId);
    }
  };

  return (
    <div className="budget-dashboard animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner: Multi-Currency Selector & Quick Add */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8))',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(16, 185, 129, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <Wallet size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
              Financial & Expense Command Center
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Real-time aggregation of manual receipts + scheduled activities
            </p>
          </div>
        </div>

        {/* Currency Switcher Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} /> View In:
          </span>
          {Object.keys(CURRENCY_CONFIG).map(curr => {
            const isSelected = displayCurrency === curr;
            return (
              <button
                key={curr}
                type="button"
                onClick={() => setDisplayCurrency(curr)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: isSelected ? 'linear-gradient(135deg, #38bdf8, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {CURRENCY_CONFIG[curr].symbol} {curr}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleOpenAddExpense}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '6px' }}
          >
            <Plus size={14} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Main Budget Health & Progress Card */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(24, 33, 56, 0.85))',
          border: `1px solid ${budgetStatus.border}`,
          boxShadow: `0 8px 30px ${budgetStatus.bg}`
        }}
      >
        {/* Status Alert Banner */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: budgetStatus.bg,
            border: `1px solid ${budgetStatus.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusIcon size={18} color={budgetStatus.color} />
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: budgetStatus.color }}>
                {budgetStatus.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                • {budgetStatus.subtext}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: budgetStatus.color }}>
              {budgetUtilizationPercent}%
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>utilized</span>
          </div>
        </div>

        {/* Dynamic Budget Progress Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              SPENT: <strong style={{ color: '#ffffff' }}>{currencySymbol}{convertedTotalSpent.toLocaleString()}</strong>
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              TARGET: <strong style={{ color: '#ffffff' }}>{currencySymbol}{convertedBudget.toLocaleString()}</strong>
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, budgetUtilizationPercent)}%`,
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background: budgetStatus.level === 'green'
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : budgetStatus.level === 'yellow'
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
                boxShadow: `0 0 12px ${budgetStatus.color}`,
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* 4-Column Financial Pulse Deck */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}
        >
          {/* Target Budget */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Target Budget
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewBudgetValue(trip.totalBudget || 0);
                  setIsEditingBudget(true);
                }}
                className="btn btn-ghost btn-icon"
                title="Edit Target Budget"
                style={{ padding: '2px' }}
              >
                <Edit2 size={12} />
              </button>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', fontWeight: 800, margin: 0 }}>
              {currencySymbol}{convertedBudget.toLocaleString()}
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              ~{currencySymbol}{dailyBudgetAllowance}/day
            </span>
          </div>

          {/* Total Spent */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Realized Spend
            </span>
            <h3 style={{ fontSize: '1.35rem', color: budgetStatus.color, fontWeight: 800, margin: '4px 0 0 0' }}>
              {currencySymbol}{convertedTotalSpent.toLocaleString()}
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {expenses.length} receipts + {stops.reduce((s, st) => s + (st.activities?.length || 0), 0)} activities
            </span>
          </div>

          {/* Remaining Balance */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Remaining Funds
            </span>
            <h3
              style={{
                fontSize: '1.35rem',
                color: convertedRemaining >= 0 ? '#34d399' : '#ef4444',
                fontWeight: 800,
                margin: '4px 0 0 0'
              }}
            >
              {convertedRemaining >= 0 ? `${currencySymbol}${convertedRemaining.toLocaleString()}` : `-${currencySymbol}${Math.abs(convertedRemaining).toLocaleString()}`}
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {convertedRemaining >= 0 ? 'Surplus Available' : 'Over Target Budget'}
            </span>
          </div>

          {/* Daily Burn Rate */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Daily Burn Pace
            </span>
            <h3 style={{ fontSize: '1.35rem', color: '#38bdf8', fontWeight: 800, margin: '4px 0 0 0' }}>
              {currencySymbol}{dailyBurnRate.toLocaleString()}
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Across {tripDays} planned voyage days
            </span>
          </div>
        </div>
      </div>

      {/* Visual Breakdown & Ledger Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Category Breakdown Chart */}
        <CategoryBreakdownChart
          categoryTotals={categoryTotals}
          totalSpent={convertedTotalSpent}
          currencySymbol={currencySymbol}
          displayCurrency={displayCurrency}
        />

        {/* Detailed Expense Ledger */}
        <ExpenseList
          expenses={expenses}
          stops={stops}
          currencySymbol={currencySymbol}
          onEditExpense={handleOpenEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onOpenAddExpense={handleOpenAddExpense}
        />
      </div>

      {/* Add / Edit Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={handleSaveExpense}
        initialData={editingExpense}
        stops={stops}
        defaultCurrency={displayCurrency}
      />

      {/* Edit Budget Quick Modal */}
      {isEditingBudget && (
        <div className="modal-overlay" onClick={() => setIsEditingBudget(false)} style={{ zIndex: 1200 }}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Update Target Budget</h3>
              </div>
              <button onClick={() => setIsEditingBudget(false)} className="btn btn-ghost btn-icon">
                ×
              </button>
            </div>

            <form onSubmit={handleSaveBudget}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Total Target Budget ({trip.currency || 'USD'})</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={newBudgetValue}
                    onChange={(e) => setNewBudgetValue(e.target.value)}
                    className="form-input"
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsEditingBudget(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
