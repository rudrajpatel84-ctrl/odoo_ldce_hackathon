import React, { useState } from 'react';
import { Plus, Search, Compass, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { TripCard } from './TripCard';
import { useTrips } from '../../context/TripContext';
import { budgetService } from '../../services/budgetService';

export function DashboardView({ onOpenStudio, onOpenNewTrip, onShareTrip }) {
  const { trips, deleteTrip, copyTrip } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.stops?.some(s => s.cityName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Overall stats
  const totalDestinations = trips.reduce((sum, t) => sum + (t.stops ? t.stops.length : 0), 0);
  const totalBudgetSpent = trips.reduce((sum, t) => {
    const b = budgetService.calculateTripBudget(t);
    return sum + b.totalSpent;
  }, 0);

  return (
    <div className="app-container">
      {/* Hero / Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(17, 24, 39, 0.7))'
          }}
        >
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8'
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>{trips.length}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Active Journeys</div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12), rgba(17, 24, 39, 0.7))'
          }}
        >
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(20, 184, 166, 0.2)',
              color: '#14b8a6'
            }}
          >
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>{totalDestinations}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Total Cities & Stops</div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(17, 24, 39, 0.7))'
          }}
        >
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#a855f7'
            }}
          >
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>
              {budgetService.formatCurrency(totalBudgetSpent, 'USD')}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Total Expenses Tracked</div>
          </div>
        </div>
      </div>

      {/* Header and Search */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Your Expeditions</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Select an itinerary to open the unified Trip Studio or start a new adventure.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', maxWidth: '400px', minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Search by trip, city, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
            />
          </div>

          <button onClick={onOpenNewTrip} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} />
            <span>New Trip</span>
          </button>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onOpenStudio={onOpenStudio}
              onShare={onShareTrip}
              onCopy={copyTrip}
              onDelete={deleteTrip}
            />
          ))}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <Compass size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>No matching journeys found</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
              {searchQuery
                ? 'Try adjusting your search query to find your trip.'
                : 'Start your voyage by creating a custom trip or selecting a curated multi-city starter template.'}
            </p>
          </div>
          <button onClick={onOpenNewTrip} className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Trip</span>
          </button>
        </div>
      )}
    </div>
  );
}
