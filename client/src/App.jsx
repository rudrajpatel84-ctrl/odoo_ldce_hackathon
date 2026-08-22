import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrips } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { AuthCard } from './components/auth/AuthCard';
import { Dashboard } from './components/dashboard/Dashboard';
import { TripDetailShell } from './components/dashboard/TripDetailShell';
import { PublicShareView } from './components/share/PublicShareView';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { AdminAnalyticsDashboard } from './components/admin/AdminAnalyticsDashboard';
import { Toast } from './components/common/Toast';
import { storageService } from './services/storageService';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { currentUser, loading } = useAuth();
  const { selectedTrip, selectTrip, clearSelectedTrip, toast, showToast, createTrip } = useTrips();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [sharedTrip, setSharedTrip] = useState(null);

  // Hash-based Public Share Viewer (#share/:token)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#share/')) {
        const token = hash.replace('#share/', '').trim();
        const foundTrip = storageService.getTripByShareToken(token);
        setSharedTrip(foundTrip || null);
      } else {
        setSharedTrip(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateHome = () => {
    window.location.hash = '';
    setSharedTrip(null);
    setIsAdminOpen(false);
    clearSelectedTrip();
  };

  const handleCopySharedTrip = async (tripToCopy) => {
    if (!currentUser) {
      if (showToast) showToast('Please log in or use Demo Login to clone this trip to your account.', 'warning');
      return;
    }
    try {
      const cloned = await createTrip({
        title: `${tripToCopy.title} (Clone)`,
        description: tripToCopy.description,
        startDate: tripToCopy.startDate,
        endDate: tripToCopy.endDate,
        totalBudget: tripToCopy.totalBudget,
        currency: tripToCopy.currency || 'USD',
        coverImage: tripToCopy.coverImage,
        stops: tripToCopy.stops || []
      });
      handleNavigateHome();
      if (showToast) showToast(`Successfully cloned "${tripToCopy.title}" into your trips!`);
      if (cloned) selectTrip(cloned);
    } catch (err) {
      if (showToast) showToast('Failed to clone trip.', 'error');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38bdf8',
            animation: 'spin 1s linear infinite'
          }}
        />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Loading GlobeTrotter Travel Studio...
        </p>
      </div>
    );
  }

  // Render Public Shared Itinerary View if hash is #share/:token
  if (sharedTrip) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          onNavigateHome={handleNavigateHome}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        <main style={{ flex: 1, padding: '1.5rem 1rem 3rem 1rem' }}>
          <PublicShareView
            trip={sharedTrip}
            onCopyTrip={handleCopySharedTrip}
            onNavigateHome={handleNavigateHome}
          />
        </main>
        <Toast toast={toast} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onNavigateHome={handleNavigateHome}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main style={{ flex: 1, padding: '1.5rem 1rem 3rem 1rem' }}>
        {currentUser ? (
          isAdminOpen ? (
            <AdminAnalyticsDashboard onBack={() => setIsAdminOpen(false)} />
          ) : selectedTrip ? (
            <TripDetailShell trip={selectedTrip} onBack={clearSelectedTrip} />
          ) : (
            <Dashboard onOpenTrip={selectTrip} />
          )
        ) : (
          <div className="app-container" style={{ maxWidth: '600px', textAlign: 'center', marginTop: '1rem' }}>
            {/* Header / Hero */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}
              >
                <Sparkles size={13} />
                <span>GlobeTrotter Travel Studio</span>
              </div>

              <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                Plan Seamless Multi-City Voyages
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                Sign up, log in, or use the 1-Click Demo to enter your personal traveler dashboard.
              </p>
            </div>

            {/* Authentication Form Card */}
            <AuthCard />
          </div>
        )}
      </main>

      {/* Traveler Profile & Settings Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Global Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </AuthProvider>
  );
}
