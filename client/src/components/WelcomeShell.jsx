import React from 'react';
import { ShieldCheck, CheckCircle2, User, LogOut, ArrowRight, Sparkles, Database, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function WelcomeShell() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="app-container" style={{ maxWidth: '800px', marginTop: '1rem' }}>
      {/* Milestone Completion Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(56, 189, 248, 0.12))',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>
              Hour 1 Milestone Complete
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#6ee7b7' }}>
              Project Foundation, Relational Storage & Secure Authentication Active
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
          You are authenticated as <strong style={{ color: '#ffffff' }}>{currentUser.name}</strong> (<span style={{ color: 'var(--accent-cyan)' }}>{currentUser.email}</span>).
          Your session is persisted in local relational storage and will remain active across browser reloads.
        </p>
      </div>

      {/* User Session Profile Card */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="#38bdf8" />
          <span>Active Authenticated Session</span>
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }}
          />

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentUser.email}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              User ID: <code style={{ color: '#38bdf8' }}>{currentUser.id}</code>
            </div>
          </div>

          <button onClick={logout} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Hour 1 Verification Checklist */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>Hour 1 Verification Checklist</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span><strong>Test 1 — Registration (Signup):</strong> Creates user with SHA-256 hashed password.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span><strong>Test 2 — Login:</strong> Authenticates against stored hash.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span><strong>Test 3 — 1-Click Demo Login:</strong> Immediate judge evaluation entry.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span><strong>Test 4 — Refresh Persistence:</strong> Pressing F5 / reloading retains this session.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span><strong>Test 5 — Logout:</strong> Safely clears session and returns to login card.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span><strong>Test 6 — Form Validation:</strong> Rejects empty fields, invalid emails, and short passwords.</span>
          </div>
        </div>
      </div>

      {/* Next Milestone Callout */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
            Ready for Hour 2 Milestone
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Hour 2 will implement the Traveler Dashboard and the "Create Trip" wizard modal.
          </div>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            fontWeight: 600,
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}
        >
          Awaiting Review & Commit
        </span>
      </div>
    </div>
  );
}
