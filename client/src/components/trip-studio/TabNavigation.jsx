import React from 'react';
import { Map, PieChart, GitCommit, Sparkles } from 'lucide-react';

export function TabNavigation({ activeTab, onSelectTab, counts }) {
  const tabs = [
    {
      id: 'itinerary',
      label: 'Itinerary & Stops',
      icon: <Map size={17} />,
      badge: counts.stops ? `${counts.stops} stops` : null
    },
    {
      id: 'budget',
      label: 'Budget & Expenses',
      icon: <PieChart size={17} />,
      badge: counts.expenses ? `${counts.expenses} logs` : null
    },
    {
      id: 'timeline',
      label: 'Visual Timeline',
      icon: <GitCommit size={17} />,
      badge: counts.activities ? `${counts.activities} events` : null
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        paddingBottom: '2px',
        overflowX: 'auto'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              border: 'none',
              background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.925rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#38bdf8' : 'var(--text-dim)'
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
