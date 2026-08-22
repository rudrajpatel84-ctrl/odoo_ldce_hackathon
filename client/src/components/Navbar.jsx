import React from 'react';
import { Compass, Sparkles, LogOut, ShieldCheck, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOfflineStatus } from '../services/offlineService';
import { useTrips } from '../context/TripContext';

export function Navbar({ onNavigateHome, onOpenProfile, onOpenAdmin }) {
  const { currentUser, logout, loginAsDemo } = useAuth();
  const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineStatus();
  const { refreshTrips } = useTrips();

  const handleManualSync = async (e) => {
    e.stopPropagation();
    await syncNow(refreshTrips);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(10, 14, 23, 0.85)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.5rem'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Brand */}
        <div
          onClick={onNavigateHome}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: onNavigateHome ? 'pointer' : 'default' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)'
            }}
          >
            <Compass size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'var(--gradient-brand)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                GlobeTrotter
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                TRAVEL STUDIO
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Intelligent Multi-City Itinerary & Expense Planner
            </p>
          </div>
        </div>

        {/* Middle: Connection & Cloud Sync Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
              border: isOnline ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.4)',
              transition: 'all 0.3s ease'
            }}
            title={isOnline ? 'Online: Cloud database synced with MongoDB Atlas' : 'Offline Mode: All edits store locally and auto-sync when online.'}
          >
            {isOnline ? (
              <>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981'
                  }}
                />
                <Wifi size={13} color="#10b981" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6ee7b7' }}>
                  {isSyncing ? 'Syncing with Cloud...' : 'Cloud Synced ✓'}
                </span>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    boxShadow: '0 0 8px #f59e0b',
                    animation: 'pulse 1.5s infinite'
                  }}
                />
                <WifiOff size={13} color="#f59e0b" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fcd34d' }}>
                  Offline Mode • Cache Protected
                </span>
              </>
            )}
          </div>

          {/* Pending Changes & 1-Click Sync Badge */}
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing || !isOnline}
              className="btn btn-sm"
              title="Click to push offline changes to MongoDB Atlas now"
              style={{
                fontSize: '0.72rem',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: isOnline ? 'pointer' : 'default'
              }}
            >
              <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
              <span>{pendingCount} pending {isSyncing ? 'syncing...' : 'sync'}</span>
            </button>
          )}
        </div>

        {/* User Controls & Admin/Profile Portal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Admin Analytics Portal Button */}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5'
                  }}
                  title="Open Admin Analytics Dashboard"
                >
                  <ShieldCheck size={13} />
                  <span>Admin Portal</span>
                </button>
              )}

              {/* User Profile Trigger Pill */}
              <div
                onClick={onOpenProfile}
                title="Click to view & edit Profile Preferences"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.1 }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#38bdf8' }}>
                    Profile Settings ⚙️
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Log Out of Session"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => loginAsDemo()}
                className="btn btn-demo btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} />
                <span>1-Click Demo Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
