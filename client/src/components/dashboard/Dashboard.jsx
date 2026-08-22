import React, { useState } from 'react';
import { Plus, Search, Compass, Calendar, DollarSign, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { TripCard } from './TripCard';
import { CreateTripModal } from './CreateTripModal';

export function Dashboard({ onOpenTrip }) {
  const { currentUser } = useAuth();
  const { trips, deleteTrip } = useTrips();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Compute summary metrics across user's trips
  const totalBudgetSum = trips.reduce((sum, t) => sum + (Number(t.totalBudget) || 0), 0);

  return (
    <div className="app-container">
      {/* Welcome Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontWeight: 600
              }}
            >
              TRAVELER DASHBOARD
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>• Hour 2 Milestone</span>
          </div>

          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            Welcome back, {currentUser?.name || 'Traveler'}!
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Plan, organize, and manage your upcoming journeys and budgets.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem' }}
        >
          <Plus size={18} />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Summary Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8'
              }}
            >
              <Compass size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                {trips.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Total Journeys
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981'
              }}
            >
              <DollarSign size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', lineHeight: 1.1 }}>
                ${totalBudgetSum.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Total Budget Allocated
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#a855f7'
              }}
            >
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a855f7', lineHeight: 1.1 }}>
                {trips.filter(t => new Date(t.startDate) >= new Date()).length}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Upcoming Voyages
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Section Header & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>
          Your Journeys ({trips.length})
        </h2>

        {trips.length > 0 && (
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Search journeys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.3rem', fontSize: '0.85rem' }}
            />
          </div>
        )}
      </div>

      {/* Trips List / Grid */}
      {filteredTrips.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onOpenTrip={onOpenTrip}
              onDeleteTrip={deleteTrip}
            />
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No journeys matching "{searchQuery}".
          </p>
        </div>
      ) : (
        /* Empty State */
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.7) 0%, rgba(10, 14, 23, 0.9) 100%)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <Compass size={32} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              No Journeys Planned Yet
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
              Kickstart your travel planning by creating your first trip. Set your dates, target budget, and adventure title.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Plan Your First Trip</span>
          </button>
        </div>
      )}

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
