import React from 'react';
import {
  Compass,
  Utensils,
  Landmark,
  Mountain,
  Heart,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle2,
  CircleDot,
  Edit2,
  Trash2,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  CloudSun
} from 'lucide-react';

export const CATEGORY_CONFIG = {
  'Sightseeing': {
    label: 'Sightseeing',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.35)',
    icon: Compass
  },
  'Food & Dining': {
    label: 'Food & Dining',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.14)',
    border: 'rgba(251, 146, 60, 0.35)',
    icon: Utensils
  },
  'Culture': {
    label: 'Culture',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.14)',
    border: 'rgba(192, 132, 252, 0.35)',
    icon: Landmark
  },
  'Adventure': {
    label: 'Adventure',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.14)',
    border: 'rgba(52, 211, 153, 0.35)',
    icon: Mountain
  },
  'Relaxation': {
    label: 'Relaxation',
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.14)',
    border: 'rgba(244, 114, 182, 0.35)',
    icon: Heart
  }
};

const TIME_SLOT_CONFIG = {
  'Morning': { icon: Sun, color: '#fcd34d', label: 'Morning' },
  'Afternoon': { icon: CloudSun, color: '#38bdf8', label: 'Afternoon' },
  'Evening': { icon: Sunset, color: '#fb923c', label: 'Evening' },
  'Night': { icon: Moon, color: '#a78bfa', label: 'Night' }
};

export function ActivityCard({
  activity,
  currency = 'USD',
  onToggleBooking,
  onEdit,
  onDelete
}) {
  if (!activity) return null;

  const categoryMeta = CATEGORY_CONFIG[activity.category] || {
    label: activity.category || 'Experience',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.3)',
    icon: Sparkles
  };
  const CategoryIcon = categoryMeta.icon;

  const slotMeta = TIME_SLOT_CONFIG[activity.timeSlot] || {
    icon: Clock,
    color: '#94a3b8',
    label: activity.timeSlot || 'Scheduled'
  };
  const SlotIcon = slotMeta.icon;

  const formatCost = (val, curr) => {
    const num = Number(val) || 0;
    if (num <= 0) return 'Free';
    const symMap = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'CA$', AUD: 'A$' };
    const sym = symMap[curr] || '$';
    return `${sym}${num.toLocaleString()}`;
  };

  const isBooked = Boolean(activity.isBooked);

  return (
    <div
      className="glass-card activity-card animate-fade-in"
      style={{
        position: 'relative',
        padding: '1.1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: isBooked
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.92) 100%)'
          : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%)',
        border: isBooked
          ? '1px solid rgba(16, 185, 129, 0.35)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isBooked
          ? '0 4px 20px rgba(16, 185, 129, 0.12)'
          : '0 4px 16px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      {/* Header Row: Category Badge, TimeSlot Pill, Duration, Cost */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Category Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              background: categoryMeta.bg,
              border: `1px solid ${categoryMeta.border}`,
              color: categoryMeta.color,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }}
          >
            <CategoryIcon size={12} />
            <span>{categoryMeta.label}</span>
          </span>

          {/* Time Slot Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: slotMeta.color,
              fontSize: '0.72rem',
              fontWeight: 500
            }}
          >
            <SlotIcon size={11} />
            <span>{activity.timeSlot || 'Anytime'}</span>
          </span>

          {/* Duration Indicator */}
          {activity.durationHours > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '3px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(148, 163, 184, 0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.72rem'
              }}
            >
              <Clock size={11} />
              <span>{activity.durationHours} {activity.durationHours === 1 ? 'hr' : 'hrs'}</span>
            </span>
          )}
        </div>

        {/* Cost Display Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: Number(activity.cost) > 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.15)',
            border: Number(activity.cost) > 0 ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            color: Number(activity.cost) > 0 ? '#38bdf8' : '#34d399',
            fontWeight: 700,
            fontSize: '0.82rem'
          }}
        >
          {formatCost(activity.cost, currency)}
        </div>
      </div>

      {/* Activity Title */}
      <div>
        <h4
          style={{
            fontSize: '0.98rem',
            fontWeight: 600,
            color: isBooked ? '#ffffff' : 'rgba(255, 255, 255, 0.95)',
            lineHeight: 1.35,
            margin: 0
          }}
        >
          {activity.title}
        </h4>

        {/* Location & Logistics Notes */}
        {activity.locationNotes && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
              marginTop: '6px',
              padding: '6px 9px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45
            }}
          >
            <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px', color: categoryMeta.color }} />
            <span>{activity.locationNotes}</span>
          </div>
        )}
      </div>

      {/* Bottom Footer: Booking Toggle Switch & Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          marginTop: '2px'
        }}
      >
        {/* Interactive Booking Switch Toggle */}
        <button
          type="button"
          onClick={() => onToggleBooking && onToggleBooking(activity.id)}
          className="btn-booking-toggle"
          title={isBooked ? 'Click to mark as Planned' : 'Click to mark as Booked / Reserved'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: isBooked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)',
            border: isBooked ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(148, 163, 184, 0.25)',
            color: isBooked ? '#6ee7b7' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {isBooked ? (
            <>
              <CheckCircle2 size={13} color="#10b981" />
              <span>Booked & Confirmed</span>
            </>
          ) : (
            <>
              <CircleDot size={13} color="#94a3b8" />
              <span>Planned (Not Booked)</span>
            </>
          )}
        </button>

        {/* Edit & Delete Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => onEdit && onEdit(activity)}
            className="btn btn-secondary btn-icon"
            title="Edit Activity Details"
            style={{
              padding: '5px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Edit2 size={12} />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(activity.id, activity.title)}
            className="btn btn-danger btn-icon"
            title="Remove Activity"
            style={{
              padding: '5px',
              borderRadius: '6px'
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
