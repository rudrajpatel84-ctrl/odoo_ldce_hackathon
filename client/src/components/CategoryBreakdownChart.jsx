import React, { useState } from 'react';
import {
  Building,
  Plane,
  Utensils,
  Sparkles,
  ShoppingBag,
  Tag,
  PieChart as PieIcon,
  TrendingUp,
  Percent
} from 'lucide-react';

export const EXPENSE_CATEGORIES = {
  'Accommodation': {
    label: 'Accommodation',
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.15)',
    border: 'rgba(99, 102, 241, 0.4)',
    icon: Building
  },
  'Transport': {
    label: 'Transport',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)',
    border: 'rgba(56, 189, 248, 0.4)',
    icon: Plane
  },
  'Food & Dining': {
    label: 'Food & Dining',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.15)',
    border: 'rgba(251, 146, 60, 0.4)',
    icon: Utensils
  },
  'Activities': {
    label: 'Activities',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.15)',
    border: 'rgba(192, 132, 252, 0.4)',
    icon: Sparkles
  },
  'Shopping': {
    label: 'Shopping',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.15)',
    border: 'rgba(52, 211, 153, 0.4)',
    icon: ShoppingBag
  },
  'Misc': {
    label: 'Misc & Other',
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.15)',
    border: 'rgba(244, 114, 182, 0.4)',
    icon: Tag
  }
};

export function CategoryBreakdownChart({
  categoryTotals = {},
  totalSpent = 0,
  currencySymbol = '$',
  displayCurrency = 'USD'
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = Object.keys(EXPENSE_CATEGORIES);
  const data = categories
    .map(cat => ({
      category: cat,
      amount: categoryTotals[cat] || 0,
      percent: totalSpent > 0 ? Math.round(((categoryTotals[cat] || 0) / totalSpent) * 100) : 0,
      meta: EXPENSE_CATEGORIES[cat]
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Calculate SVG Donut arcs
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <PieIcon size={16} />
          </div>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
            Category Spending Distribution
          </h3>
        </div>

        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {data.length} {data.length === 1 ? 'Category' : 'Categories'} active
        </span>
      </div>

      {totalSpent > 0 && data.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', alignItems: 'center' }}>
          {/* SVG Donut Chart */}
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth={strokeWidth}
              />

              {/* Data segments */}
              {data.map((item, index) => {
                const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                cumulativePercent += item.percent;
                const isHovered = hoveredCategory === item.category;

                return (
                  <circle
                    key={index}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={item.meta.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transition: 'all 0.25s ease',
                      cursor: 'pointer',
                      filter: isHovered ? `drop-shadow(0 0 8px ${item.meta.color})` : 'none'
                    }}
                    onMouseEnter={() => setHoveredCategory(item.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {hoveredCategory || 'Total Spent'}
              </span>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                {hoveredCategory
                  ? `${currencySymbol}${(categoryTotals[hoveredCategory] || 0).toLocaleString()}`
                  : `${currencySymbol}${totalSpent.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Category Bars & Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {data.map((item, index) => {
              const Icon = item.meta.icon;
              const isHovered = hoveredCategory === item.category;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: isHovered ? item.meta.bg : 'rgba(255, 255, 255, 0.02)',
                    border: isHovered ? `1px solid ${item.meta.border}` : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: item.meta.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.meta.color
                        }}
                      >
                        <Icon size={11} />
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                        {item.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.meta.color }}>
                        {currencySymbol}{item.amount.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', minWidth: '32px', textAlign: 'right' }}>
                        {item.percent}%
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.percent}%`,
                        height: '100%',
                        background: item.meta.color,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <TrendingUp size={28} style={{ margin: '0 auto 0.5rem auto', opacity: 0.6, color: '#38bdf8' }} />
          <p style={{ fontSize: '0.85rem', margin: 0 }}>No expenses logged yet. Add your first expense to see the visual category distribution.</p>
        </div>
      )}
    </div>
  );
}
