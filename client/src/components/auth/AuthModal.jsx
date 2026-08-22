import React, { useState } from 'react';
import { X, Sparkles, LogIn, UserPlus, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const { login, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    login(email, password);
    onClose();
  };

  const handleDemo = () => {
    loginAsDemo();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.15rem' }}>
              {isRegister ? 'Create GlobeTrotter Account' : 'Sign in to GlobeTrotter'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Demo Access banner for Hackathon reviewers */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem' }}>
              <Sparkles size={16} />
              <span>Instant Hackathon Evaluation Access</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Skip manual registration and explore pre-populated trips (Japan Grand Tour, Italian Riviera) instantly.
            </p>
            <button
              onClick={handleDemo}
              className="btn btn-primary btn-sm"
              style={{ alignSelf: 'flex-start', marginTop: '4px' }}
            >
              Sign in as Demo Traveler
            </button>
          </div>

          <div style={{ textAlign: 'center', margin: '0.75rem 0', position: 'relative' }}>
            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <span
              style={{
                position: 'absolute',
                top: '-9px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#0f172a',
                padding: '0 8px',
                fontSize: '0.75rem',
                color: 'var(--text-dim)'
              }}
            >
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
              <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-cyan)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
