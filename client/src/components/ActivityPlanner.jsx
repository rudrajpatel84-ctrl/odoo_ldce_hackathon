import React, { useState, useMemo } from 'react';
import {
  Plus,
  Sparkles,
  Search,
  CheckCircle2,
  CircleDot,
  DollarSign,
  Clock,
  Compass,
  Utensils,
  Landmark,
  Mountain,
  Heart,
  X,
  Layers,
  Flame,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { ActivityCard, CATEGORY_CONFIG } from './ActivityCard';
import { ActivityPresetSelector } from './ActivityPresetSelector';

const CATEGORIES = ['All', 'Sightseeing', 'Food & Dining', 'Culture', 'Adventure', 'Relaxation'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

export function ActivityPlanner({
  tripId,
  stop,
  currency = 'USD',
  isCollapsedDefault = false
}) {
  const { addActivity, updateActivity, deleteActivity, toggleActivityBooking } = useTrips();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingFilter, setBookingFilter] = useState('all'); // 'all' | 'booked' | 'planned'
  const [sortBy, setSortBy] = useState('timeSlot'); // 'timeSlot' | 'costAsc' | 'costDesc' | 'duration' | 'title'
  const [isExpanded, setIsExpanded] = useState(!isCollapsedDefault);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Activity Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Sightseeing');
  const [formCost, setFormCost] = useState(0);
  const [formDurationHours, setFormDurationHours] = useState(2);
  const [formTimeSlot, setFormTimeSlot] = useState('Morning');
  const [formIsBooked, setFormIsBooked] = useState(false);
  const [formLocationNotes, setFormLocationNotes] = useState('');

  const activities = stop?.activities || [];

  // Real-time calculations for this stop
  const stats = useMemo(() => {
    const totalCount = activities.length;
    const bookedCount = activities.filter(a => a.isBooked).length;
    const plannedCount = totalCount - bookedCount;
    const totalCost = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    const bookedCost = activities
      .filter(a => a.isBooked)
      .reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    const progressPercent = totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : 0;

    return {
      totalCount,
      bookedCount,
      plannedCount,
      totalCost,
      bookedCost,
      progressPercent
    };
  }, [activities]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: activities.length };
    CATEGORIES.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = activities.filter(a => a.category === cat).length;
      }
    });
    return counts;
  }, [activities]);

  // Filtered & Sorted Activities
  const filteredActivities = useMemo(() => {
    const timeSlotRank = { 'Morning': 1, 'Afternoon': 2, 'Evening': 3, 'Night': 4 };

    return activities
      .filter(a => {
        const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
        const matchesBooking =
          bookingFilter === 'all'
            ? true
            : bookingFilter === 'booked'
            ? a.isBooked
            : !a.isBooked;
        const matchesSearch =
          !searchQuery.trim() ||
          a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.locationNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.timeSlot?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesBooking && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'timeSlot') {
          return (timeSlotRank[a.timeSlot] || 99) - (timeSlotRank[b.timeSlot] || 99);
        }
        if (sortBy === 'costAsc') return (Number(a.cost) || 0) - (Number(b.cost) || 0);
        if (sortBy === 'costDesc') return (Number(b.cost) || 0) - (Number(a.cost) || 0);
        if (sortBy === 'duration') return (Number(b.durationHours) || 0) - (Number(a.durationHours) || 0);
        if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
  }, [activities, selectedCategory, bookingFilter, searchQuery, sortBy]);

  const handleOpenAddModal = () => {
    setEditingActivity(null);
    setFormTitle('');
    setFormCategory('Sightseeing');
    setFormCost(0);
    setFormDurationHours(2);
    setFormTimeSlot('Morning');
    setFormIsBooked(false);
    setFormLocationNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (activity) => {
    setEditingActivity(activity);
    setFormTitle(activity.title || '');
    setFormCategory(activity.category || 'Sightseeing');
    setFormCost(activity.cost || 0);
    setFormDurationHours(activity.durationHours || 2);
    setFormTimeSlot(activity.timeSlot || 'Morning');
    setFormIsBooked(Boolean(activity.isBooked));
    setFormLocationNotes(activity.locationNotes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const payload = {
      title: formTitle.trim(),
      category: formCategory,
      cost: Math.max(0, Number(formCost) || 0),
      durationHours: Math.max(0.25, Number(formDurationHours) || 1),
      timeSlot: formTimeSlot,
      isBooked: formIsBooked,
      locationNotes: formLocationNotes.trim()
    };

    if (editingActivity) {
      updateActivity(tripId, stop.id, editingActivity.id, payload);
    } else {
      addActivity(tripId, stop.id, payload);
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteActivity = (activityId, title) => {
    if (window.confirm(`Remove "${title}" from ${stop.cityName}?`)) {
      deleteActivity(tripId, stop.id, activityId);
    }
  };

  const handleToggleBooking = (activityId) => {
    toggleActivityBooking(tripId, stop.id, activityId);
  };

  const handleAddPresetActivity = (presetData) => {
    addActivity(tripId, stop.id, presetData);
  };

  const handleAddMultiplePresets = (presets) => {
    presets.forEach(p => {
      addActivity(tripId, stop.id, p);
    });
  };

  const formatCurrency = (amount) => {
    const symMap = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'CA$', AUD: 'A$' };
    const sym = symMap[currency] || (currency === 'INR' ? '₹' : '$');
    return `${sym}${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <div
      className="activity-planner"
      style={{
        marginTop: '1.25rem',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(56, 189, 248, 0.18)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Top Header Row & Collapsible Switch */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <Compass size={18} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
                {stop.cityName} Activities & Experiences
              </h4>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontWeight: 600
                }}
              >
                {stats.totalCount} {stats.totalCount === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Day planner, category tags, curated city presets, and booked reservations
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsPresetModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(56, 189, 248, 0.15))',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#d8b4fe',
              fontWeight: 600,
              fontSize: '0.78rem'
            }}
          >
            <Sparkles size={13} color="#c084fc" />
            <span>Curated Presets</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            <Plus size={14} />
            <span>Add Activity</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="btn btn-ghost btn-icon"
            style={{ padding: '6px' }}
            title={isExpanded ? 'Collapse Planner' : 'Expand Planner'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Progress & Live Sync Summary Bar */}
      {isExpanded && (
        <div
          className="glass-card animate-fade-in"
          style={{
            marginTop: '1rem',
            padding: '0.9rem 1.1rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.5))',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '0.65rem' }}>
            {/* Booking Stats Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {stats.bookedCount} Booked
                </span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {stats.plannedCount} Planned
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: stats.progressPercent === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                  border: stats.progressPercent === 100 ? '1px solid #10b981' : '1px solid rgba(56, 189, 248, 0.3)',
                  color: stats.progressPercent === 100 ? '#6ee7b7' : '#38bdf8',
                  fontWeight: 700
                }}
              >
                {stats.progressPercent}% Prepared
              </span>
            </div>

            {/* Total Expense Calculated */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Activity Total:</span>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem' }}>
                {formatCurrency(stats.totalCost)}
              </span>
              {stop.budgetAllocation > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  ({Math.round((stats.totalCost / stop.budgetAllocation) * 100)}% of stop budget)
                </span>
              )}
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${stats.progressPercent}%`,
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background: stats.progressPercent === 100
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #38bdf8, #6366f1)',
                transition: 'width 0.4s ease',
                boxShadow: stats.progressPercent > 0 ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Filter & Controls Toolbar */}
      {isExpanded && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Row 1: Category Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}
          >
            {CATEGORIES.map(cat => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
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
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25))'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected
                      ? '1px solid rgba(56, 189, 248, 0.45)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  <span>{cat}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#ffffff' : 'var(--text-dim)'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Search, Booking Status, Sort Dropdown */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Quick Search */}
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search activities or notes..."
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

            {/* Booking Filter Toggle */}
            <div style={{ display: 'flex', gap: '3px', background: 'rgba(0, 0, 0, 0.25)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                onClick={() => setBookingFilter('all')}
                className={`btn btn-sm ${bookingFilter === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setBookingFilter('booked')}
                className={`btn btn-sm ${bookingFilter === 'booked' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ padding: '4px 8px', fontSize: '0.72rem', color: bookingFilter === 'booked' ? '#6ee7b7' : undefined }}
              >
                Booked
              </button>
              <button
                type="button"
                onClick={() => setBookingFilter('planned')}
                className={`btn btn-sm ${bookingFilter === 'planned' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
              >
                Planned
              </button>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', height: '34px', padding: '0 24px 0 10px', fontSize: '0.76rem' }}
            >
              <option value="timeSlot">Sort: Time of Day</option>
              <option value="costAsc">Cost: Low to High</option>
              <option value="costDesc">Cost: High to Low</option>
              <option value="duration">Duration: Longest</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      )}

      {/* Activities Grid */}
      {isExpanded && (
        <div style={{ marginTop: '1.25rem' }}>
          {filteredActivities.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '0.85rem'
              }}
            >
              {filteredActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  currency={currency}
                  onToggleBooking={handleToggleBooking}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteActivity}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed rgba(255, 255, 255, 0.1)'
              }}
            >
              <Sparkles size={28} color="#38bdf8" style={{ margin: '0 auto 0.5rem auto', opacity: 0.8 }} />
              <h5 style={{ fontSize: '0.95rem', color: '#ffffff', margin: '0 0 0.25rem 0' }}>
                {activities.length === 0 ? `No activities planned for ${stop.cityName} yet` : 'No matching activities'}
              </h5>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                {activities.length === 0
                  ? 'Add bespoke adventures or explore 1-click curated experiences for this stop.'
                  : 'Try adjusting your search query or category filters.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsPresetModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Sparkles size={13} color="#c084fc" />
                  <span>Curated City Presets</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Plus size={14} />
                  <span>Add Custom Activity</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Activity Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)} style={{ zIndex: 1100 }}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                  {editingActivity ? `Edit Activity in ${stop.cityName}` : `Add Activity to ${stop.cityName}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-icon"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveActivity}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Activity Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fushimi Inari Torii Gates Sunrise Hike"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="form-input"
                    autoFocus
                  />
                </div>

                {/* Category & Time Slot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="form-select"
                    >
                      <option value="Sightseeing">Sightseeing 🏛️</option>
                      <option value="Food & Dining">Food & Dining 🍜</option>
                      <option value="Culture">Culture ⛩️</option>
                      <option value="Adventure">Adventure 🧗</option>
                      <option value="Relaxation">Relaxation 🌸</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time Slot</label>
                    <select
                      value={formTimeSlot}
                      onChange={(e) => setFormTimeSlot(e.target.value)}
                      className="form-select"
                    >
                      {TIME_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cost & Duration */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Estimated Cost ({currency})</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formCost}
                        onChange={(e) => setFormCost(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '28px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration (Hours)</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="number"
                        min="0.25"
                        max="24"
                        step="0.5"
                        value={formDurationHours}
                        onChange={(e) => setFormDurationHours(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '32px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Location Notes */}
                <div className="form-group">
                  <label className="form-label">Location Notes & Practical Tips</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Meet at North Gate, bring comfortable walking shoes, reserve sunset slot in advance..."
                    value={formLocationNotes}
                    onChange={(e) => setFormLocationNotes(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                {/* Booking Checkbox */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: formIsBooked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: formIsBooked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    id="isBookedCheck"
                    checked={formIsBooked}
                    onChange={(e) => setFormIsBooked(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <label htmlFor="isBookedCheck" style={{ fontSize: '0.85rem', color: '#ffffff', cursor: 'pointer', margin: 0 }}>
                    <strong>Mark as Booked / Reserved</strong> (Ticket purchased or table reserved)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Plus size={15} />
                  <span>{editingActivity ? 'Save Changes' : 'Add to Stop'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-Click Curated Presets Modal */}
      <ActivityPresetSelector
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        cityName={stop.cityName}
        currency={currency}
        onAddActivity={handleAddPresetActivity}
        onAddMultipleActivities={handleAddMultiplePresets}
      />
    </div>
  );
}
