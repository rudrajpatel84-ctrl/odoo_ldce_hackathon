import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#f43f5e" />,
    info: <Info size={18} color="#38bdf8" />
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        borderRadius: '12px',
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.15)',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {icons[toast.type] || icons.info}
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#f8fafc' }}>
        {toast.message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            marginLeft: '4px'
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
