import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  MapPin,
  Tag,
  Filter,
  DollarSign,
  ArrowUpDown,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { EXPENSE_CATEGORIES } from './CategoryBreakdownChart';

export function ExpenseList({
  expenses = [],
  stops = [],
  currencySymbol = '$',
  onEditExpense,
  onDeleteExpense,
  onOpenAddExpense
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStopId, setSelectedStopId] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc'); // 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc'

  const stopMap = useMemo(() => {
    const map = {};
    stops.forEach(s => {
      map[s.id] = s.cityName;
    });
    return map;
  }, [stops]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: expenses.length };
    Object.keys(EXPENSE_CATEGORIES).forEach(cat => {
      counts[cat] = expenses.filter(e => e.category === cat).length;
    });
    return counts;
  }, [expenses]);

  // Filtered & Sorted
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(e => {
        const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
        const matchesStop = selectedStopId === 'all' || e.cityStopId === selectedStopId;
        const cityName = e.cityStopId ? (stopMap[e.cityStopId] || '') : '';
        const matchesSearch =
          !searchQuery.trim() ||
          e.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cityName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesStop && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'dateDesc') return new Date(b.date || 0) - new Date(a.date || 0);
        if (sortBy === 'dateAsc') return new Date(a.date || 0) - new Date(b.date || 0);
        if (sortBy === 'amountDesc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
        if (sortBy === 'amountAsc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
        return 0;
      });
  }, [expenses, selectedCategory, selectedStopId, searchQuery, sortBy, stopMap]);

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.65))',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}
          >
            <FileSpreadsheet size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Detailed Expense Ledger
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Logged receipts, travel transactions, and payment methods
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddExpense}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
        >
          <Plus size={14} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filter Tabs Row */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {['All', ...Object.keys(EXPENSE_CATEGORIES)].map(cat => {
          const count = categoryCounts[cat] || 0;
          const isSelected = selectedCategory === cat;
          const meta = EXPENSE_CATEGORIES[cat];

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: isSelected
                  ? meta ? meta.bg : 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25))'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? meta ? `1px solid ${meta.border}` : '1px solid rgba(56, 189, 248, 0.45)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isSelected ? meta ? meta.color : '#ffffff' : 'var(--text-muted)'
              }}
            >
              <span>{cat}</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: isSelected ? '#ffffff' : 'var(--text-dim)'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search merchant, notes, or payment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '30px', paddingRight: '28px', height: '34px', fontSize: '0.8rem' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {stops.length > 0 && (
          <select
            value={selectedStopId}
            onChange={(e) => setSelectedStopId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', height: '34px', padding: '0 24px 0 10px', fontSize: '0.76rem' }}
          >
            <option value="all">All Stops</option>
            {stops.map(s => (
              <option key={s.id} value={s.id}>{s.cityName}</option>
            ))}
          </select>
        )}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select"
          style={{ width: 'auto', height: '34px', padding: '0 24px 0 10px', fontSize: '0.76rem' }}
        >
          <option value="dateDesc">Newest Date</option>
          <option value="dateAsc">Oldest Date</option>
          <option value="amountDesc">Highest Amount</option>
          <option value="amountAsc">Lowest Amount</option>
        </select>
      </div>

      {/* Expense Items List */}
      {filteredExpenses.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredExpenses.map((expense) => {
            const meta = EXPENSE_CATEGORIES[expense.category] || EXPENSE_CATEGORIES['Misc'];
            const Icon = meta.icon;
            const cityName = expense.cityStopId ? stopMap[expense.cityStopId] : null;

            return (
              <div
                key={expense.id}
                className="glass-card animate-fade-in"
                style={{
                  padding: '0.9rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {/* Category Icon Badge */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: meta.bg,
                      border: `1px solid ${meta.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: meta.color,
                      flexShrink: 0
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Note & Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600, margin: 0 }}>
                      {expense.note || expense.category}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          background: meta.bg,
                          color: meta.color,
                          fontWeight: 600
                        }}
                      >
                        {expense.category}
                      </span>

                      {cityName && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#38bdf8' }}>
                          <MapPin size={11} /> {cityName}
                        </span>
                      )}

                      {expense.date && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={11} /> {expense.date}
                        </span>
                      )}

                      {expense.paymentMethod && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CreditCard size={11} /> {expense.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>
                    {currencySymbol}{Number(expense.amount || 0).toLocaleString()}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => onEditExpense(expense)}
                      className="btn btn-secondary btn-icon"
                      title="Edit Expense"
                      style={{ padding: '5px', borderRadius: '6px' }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(expense.id, expense.note || expense.category)}
                      className="btn btn-danger btn-icon"
                      title="Delete Expense"
                      style={{ padding: '5px', borderRadius: '6px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Tag size={28} style={{ margin: '0 auto 0.5rem auto', opacity: 0.6, color: '#38bdf8' }} />
          <p style={{ fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
            {expenses.length === 0 ? 'No expenses recorded yet.' : 'No expenses match the current filter.'}
          </p>
          <button
            type="button"
            onClick={onOpenAddExpense}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Plus size={14} />
            <span>Add First Expense</span>
          </button>
        </div>
      )}
    </div>
  );
}
