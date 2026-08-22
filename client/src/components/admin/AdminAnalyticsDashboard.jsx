import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Compass,
  DollarSign,
  TrendingUp,
  MapPin,
  Sparkles,
  Calendar,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Activity,
  Globe2
} from 'lucide-react';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';

export function AdminAnalyticsDashboard({ onBack }) {
  const { trips } = useTrips();
  const { currentUser } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  // Aggregated analytics
  const totalTripsCount = trips.length;
  const totalStopsCount = trips.reduce((sum, t) => sum + (t.stops?.length || 0), 0);
  const totalActivitiesCount = trips.reduce((sum, t) => {
    return sum + (t.stops || []).reduce((actSum, s) => actSum + (s.activities?.length || 0), 0);
  }, 0);
  const totalBudgetVolume = trips.reduce((sum, t) => sum + (Number(t.totalBudget) || 0), 0);

  // Top Destination Cities
  const topCities = useMemo(() => {
    const counts = {};
    trips.forEach(t => {
      (t.stops || []).forEach(s => {
        const cityKey = `${s.cityName}, ${s.country || 'Global'}`;
        counts[cityKey] = (counts[cityKey] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [trips]);

  // Top Activity Categories
  const activityCategoryBreakdown = useMemo(() => {
    const cats = {
      'Sightseeing': 0,
      'Food & Dining': 0,
      'Culture': 0,
      'Adventure': 0,
      'Relaxation': 0
    };
    trips.forEach(t => {
      (t.stops || []).forEach(s => {
        (s.activities || []).forEach(a => {
          if (cats[a.category] !== undefined) {
            cats[a.category] += 1;
          } else {
            cats['Culture'] += 1;
          }
        });
      });
    });
    return cats;
  }, [trips]);

  // Simulated Registered Users Table
  const platformUsers = [
    { id: 'usr-1', name: 'Demo Explorer (You)', email: 'demo@globetrotter.io', tripsCount: trips.length, role: 'Super Admin', status: 'Active', joined: '2026-01-15' },
    { id: 'usr-2', name: 'Elena Rostova', email: 'elena.rostova@voyages.com', tripsCount: 4, role: 'Verified Voyager', status: 'Active', joined: '2026-02-10' },
    { id: 'usr-3', name: 'Kenji Sato', email: 'kenji.sato@tokyotravel.jp', tripsCount: 3, role: 'Local Guide', status: 'Active', joined: '2026-03-01' },
    { id: 'usr-4', name: 'Marcus Vance', email: 'm.vance@adventurepulse.org', tripsCount: 2, role: 'Explorer', status: 'Active', joined: '2026-03-18' }
  ];

  const filteredUsers = platformUsers.filter(u =>
    u.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(filterQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Traveler Dashboard</span>
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            fontSize: '0.78rem',
            fontWeight: 700
          }}
        >
          <ShieldAlert size={14} />
          <span>Admin & Platform Analytics Portal</span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <BarChart3 size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#ffffff', margin: 0, fontWeight: 800 }}>
              GlobeTrotter Global Analytics
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Live platform metrics, user engagement velocity, and worldwide travel trends
            </p>
          </div>
        </div>
      </div>

      {/* 4-Stat Core KPI Pulse Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Voyages
            </span>
            <Compass size={16} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, margin: 0 }}>
            {totalTripsCount}
          </h3>
          <span style={{ fontSize: '0.74rem', color: '#38bdf8' }}>
            {totalStopsCount} city stops mapped
          </span>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Planned Budget Volume
            </span>
            <DollarSign size={16} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#34d399', fontWeight: 800, margin: 0 }}>
            ${totalBudgetVolume.toLocaleString()}
          </h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            Cumulative trip targets
          </span>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Experiences
            </span>
            <Sparkles size={16} color="#c084fc" />
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#c084fc', fontWeight: 800, margin: 0 }}>
            {totalActivitiesCount}
          </h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            Scheduled itinerary items
          </span>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(251, 146, 60, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Explorers
            </span>
            <Users size={16} color="#fb923c" />
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#fb923c', fontWeight: 800, margin: 0 }}>
            {platformUsers.length}
          </h3>
          <span style={{ fontSize: '0.74rem', color: '#34d399' }}>
            100% Verified status
          </span>
        </div>
      </div>

      {/* Grid: Top Destinations & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Top Destination Cities */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <MapPin size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Top Trending Destination Cities
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {topCities.length > 0 ? (
              topCities.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', minWidth: '20px' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                      {item.city}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.74rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      fontWeight: 600
                    }}
                  >
                    {item.count} {item.count === 1 ? 'Stop' : 'Stops'}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No stops recorded yet.</p>
            )}
          </div>
        </div>

        {/* Experience Activity Category Breakdown */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Sparkles size={18} color="#c084fc" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Activity Category Popularity
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(activityCategoryBreakdown).map(([cat, count], idx) => {
              const colors = {
                'Sightseeing': '#38bdf8',
                'Food & Dining': '#fb923c',
                'Culture': '#c084fc',
                'Adventure': '#34d399',
                'Relaxation': '#f472b6'
              };
              const color = colors[cat] || '#38bdf8';

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px' }}>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{cat}</span>
                    <span style={{ color: color, fontWeight: 700 }}>{count} activities</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, count * 15)}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Management & Security Table */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Platform User Management & Access Control
            </h3>
          </div>

          <input
            type="text"
            placeholder="Search travelers..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="form-input"
            style={{ width: '220px', height: '34px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px' }}>User</th>
                <th style={{ padding: '8px' }}>Email</th>
                <th style={{ padding: '8px' }}>Role</th>
                <th style={{ padding: '8px' }}>Trips</th>
                <th style={{ padding: '8px' }}>Status</th>
                <th style={{ padding: '8px' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 600, color: '#ffffff' }}>{user.name}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>{user.email}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: user.role.includes('Admin') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: user.role.includes('Admin') ? '#f87171' : '#38bdf8',
                        fontWeight: 600,
                        fontSize: '0.74rem'
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', color: '#cbd5e1', fontWeight: 600 }}>{user.tripsCount}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                      <CheckCircle2 size={13} /> {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-dim)' }}>{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
