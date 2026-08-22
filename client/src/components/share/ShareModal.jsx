import React, { useState } from 'react';
import { X, Share2, Copy, Check, Globe2, Sparkles, ExternalLink } from 'lucide-react';

export function ShareModal({ isOpen, onClose, trip, onOpenPublicView }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}#share/${trip.shareToken || trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.15rem' }}>Share Itinerary</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Globe2 size={24} color="#38bdf8" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#ffffff' }}>
                Public Read-Only Access
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Anyone with this link can view the complete itinerary, roadmap, and budget metrics or clone it to their own dashboard.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Shareable Link</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="form-input"
                style={{ fontSize: '0.85rem', color: '#38bdf8', background: 'rgba(0,0,0,0.3)' }}
              />
              <button
                onClick={handleCopyLink}
                className={`btn ${copied ? 'btn-secondary' : 'btn-primary'}`}
                style={{ minWidth: '100px' }}
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Preview Public Viewer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Experience what your travelers and companions see
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPublicView(trip.shareToken || trip.id);
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Launch View</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
