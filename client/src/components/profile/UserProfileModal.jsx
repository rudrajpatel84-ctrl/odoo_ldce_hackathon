import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  DollarSign,
  Globe,
  Heart,
  Shield,
  Trash2,
  Check,
  Sparkles,
  Save,
  Moon,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';

export function UserProfileModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useTrips();

  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [preferredCurrency, setPreferredCurrency] = useState(currentUser?.preferredCurrency || 'USD');
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage || 'English (US)');
  const [savedDestinations, setSavedDestinations] = useState(
    currentUser?.savedDestinations || ['Tokyo, Japan', 'Rome, Italy', 'Kyoto, Japan', 'Paris, France']
  );
  const [newDestination, setNewDestination] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleAddDestination = (e) => {
    e.preventDefault();
    if (!newDestination.trim()) return;
    if (!savedDestinations.includes(newDestination.trim())) {
      setSavedDestinations([...savedDestinations, newDestination.trim()]);
    }
    setNewDestination('');
  };

  const handleRemoveDestination = (dest) => {
    setSavedDestinations(savedDestinations.filter(d => d !== dest));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (updateProfile) {
        await updateProfile({
          name: name.trim(),
          avatar: avatar.trim(),
          preferredCurrency,
          preferredLanguage,
          savedDestinations
        });
      }
      setIsSaved(true);
      if (showToast) showToast('Profile settings saved successfully!');
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1250 }}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '95%',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(24, 33, 56, 0.96))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Traveler Profile & Settings</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage your identity and currency preferences
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* User Profile Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}
            >
              <img
                src={avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || 'traveler')}`}
                alt="Avatar"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '2px solid #38bdf8',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>
                  {name || currentUser.name || 'Traveler'}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {currentUser.email}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontWeight: 600,
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Verified Traveler
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      fontWeight: 600,
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    Pro Voyager
                  </span>
                </div>
              </div>
            </div>

            {/* Name & Avatar URL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Display Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Currency & Language Preferences */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Default Currency</label>
                <select
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value)}
                  className="form-select"
                >
                  <option value="INR">₹ INR - Indian Rupee</option>
                  <option value="USD">$ USD - US Dollar</option>
                  <option value="EUR">€ EUR - Euro</option>
                  <option value="GBP">£ GBP - British Pound</option>
                  <option value="JPY">¥ JPY - Japanese Yen</option>
                  <option value="CAD">CA$ CAD - Canadian Dollar</option>
                  <option value="AUD">A$ AUD - Australian Dollar</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="form-select"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="Japanese (日本語)">Japanese (日本語)</option>
                  <option value="Spanish (Español)">Spanish (Español)</option>
                  <option value="German (Deutsch)">German (Deutsch)</option>
                </select>
              </div>
            </div>

            {/* Saved Dream Destinations Wishlist */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={14} color="#f43f5e" />
                <span>Saved Dream Destinations Wishlist</span>
              </label>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. Reykjavik, Iceland or Swiss Alps"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="form-input"
                  style={{ height: '36px', fontSize: '0.82rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddDestination}
                  className="btn btn-secondary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {savedDestinations.map((dest, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px 3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    <span>{dest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(dest)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        padding: '1px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {isSaved ? <Check size={16} /> : <Save size={16} />}
              <span>{isSaved ? 'Preferences Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
