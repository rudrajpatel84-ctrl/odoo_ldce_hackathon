import { hashPassword, verifyPassword } from './crypto.js';
import { INITIAL_TRIPS } from './mockData.js';
import { api } from './api.js';

const STORAGE_KEY_USERS = 'globetrotter_users_v1';
const STORAGE_KEY_AUTH = 'globetrotter_auth_session_v1';
const STORAGE_KEY_TRIPS = 'globetrotter_trips_v1';
const STORAGE_KEY_STOPS = 'globetrotter_stops_v1';
const STORAGE_KEY_ACTIVITIES = 'globetrotter_activities_v1';
const STORAGE_KEY_EXPENSES = 'globetrotter_expenses_v1';

// SHA-256 hash of "demo123"
const DEMO_PASSWORD_HASH = '89e01536ac207279409d4de1e5253e01f4a1769e696db0d6062ca9b8f56767c8';

export const storageService = {
  /**
   * Initializes relational tables and seeds demo account & trips if empty.
   */
  async init() {
    // 1. Users Table
    if (!localStorage.getItem(STORAGE_KEY_USERS)) {
      const demoUser = {
        id: 'user-demo-1',
        email: 'demo@globetrotter.io',
        passwordHash: DEMO_PASSWORD_HASH,
        name: 'Demo Traveler',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([demoUser]));
    }

    // 2. Trips Table - Seed rich multi-city itineraries
    if (!localStorage.getItem(STORAGE_KEY_TRIPS)) {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(INITIAL_TRIPS));
    } else {
      // Auto-migrate any existing trips
      try {
        const existingTripsRaw = localStorage.getItem(STORAGE_KEY_TRIPS);
        const trips = JSON.parse(existingTripsRaw);
        let changed = false;

        trips.forEach(trip => {
          if (trip.userId === 'user-demo-1') {
            const initialMatch = INITIAL_TRIPS.find(it => it.id === trip.id);
            if (initialMatch) {
              if (trip.stops) {
                trip.stops.forEach(stop => {
                  const initialStop = initialMatch.stops?.find(is => is.id === stop.id || is.cityName === stop.cityName);
                  if (initialStop && (!stop.activities || stop.activities.length === 0 || stop.activities.some(a => !a.durationHours || !a.timeSlot))) {
                    stop.activities = initialStop.activities || [];
                    changed = true;
                  }
                });
              }
              if (!Array.isArray(trip.expenses) || trip.expenses.length === 0 || trip.expenses.some(e => !e.paymentMethod || !e.category)) {
                trip.expenses = initialMatch.expenses || [];
                changed = true;
              }
            }
          }
          // Ensure all trips have expenses array and stops have activities array
          if (!Array.isArray(trip.expenses)) {
            trip.expenses = [];
            changed = true;
          }
          if (trip.stops) {
            trip.stops.forEach(stop => {
              if (!Array.isArray(stop.activities)) {
                stop.activities = [];
                changed = true;
              }
            });
          }
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
        }
      } catch (err) {
        console.error('Error during trips migration:', err);
      }
    }

    if (!localStorage.getItem(STORAGE_KEY_STOPS)) {
      localStorage.setItem(STORAGE_KEY_STOPS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEY_ACTIVITIES)) {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEY_EXPENSES)) {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify([]));
    }
  },

  /**
   * Helper to fetch all users
   */
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Register a new user with real MongoDB backend and JWT
   */
  async registerUser({ name, email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanEmail) throw new Error('Email address is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    try {
      // 1. Try real MongoDB registration
      const data = await api.post('/auth/register', {
        name: cleanName || cleanEmail.split('@')[0],
        email: cleanEmail,
        password
      });

      if (data?.token && data?.user) {
        api.setToken(data.token);
        this.setAuthSession(data.user);
        return data.user;
      }
    } catch (err) {
      // If server returned a business validation error (e.g. 409 account already exists or 400), propagate it!
      if (err.status && err.status < 500) {
        throw err;
      }
      console.warn('Backend unavailable, falling back to local storage auth:', err.message);
    }

    // 2. Offline fallback
    await this.init();
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name: cleanName || cleanEmail.split('@')[0],
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      preferredCurrency: 'INR',
      preferredLanguage: 'English (US)',
      savedDestinations: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    const { passwordHash: _, ...safeUser } = newUser;
    this.setAuthSession(safeUser);
    return safeUser;
  },

  /**
   * Authenticate a user with real MongoDB backend and JWT
   */
  async authenticateUser({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) throw new Error('Email address is required.');
    if (!password) throw new Error('Password is required.');

    try {
      // 1. Try real MongoDB authentication
      const data = await api.post('/auth/login', {
        email: cleanEmail,
        password
      });

      if (data?.token && data?.user) {
        api.setToken(data.token);
        this.setAuthSession(data.user);
        return data.user;
      }
    } catch (err) {
      if (err.status && err.status < 500) {
        throw err;
      }
      console.warn('Backend unavailable, falling back to local storage login:', err.message);
    }

    // 2. Offline fallback
    await this.init();
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const { passwordHash: _, ...safeUser } = user;
    this.setAuthSession(safeUser);
    return safeUser;
  },

  /**
   * 1-Click Demo Login with real MongoDB backend and JWT
   */
  async getDemoUser() {
    try {
      // 1. Try real MongoDB demo login
      const data = await api.post('/auth/demo', {});
      if (data?.token && data?.user) {
        api.setToken(data.token);
        this.setAuthSession(data.user);
        return data.user;
      }
    } catch (err) {
      console.warn('Backend demo login failed, falling back to local demo:', err.message);
    }

    // 2. Offline fallback
    await this.init();
    const users = this.getUsers();
    let demoUser = users.find(u => u.email === 'demo@globetrotter.io');

    if (!demoUser) {
      demoUser = {
        id: 'user-demo-1',
        email: 'demo@globetrotter.io',
        passwordHash: DEMO_PASSWORD_HASH,
        name: 'Demo Traveler',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        preferredCurrency: 'INR',
        preferredLanguage: 'English (US)',
        savedDestinations: ['Daman, India', 'Ahmedabad, India', 'Tokyo, Japan', 'Rome, Italy'],
        createdAt: new Date().toISOString()
      };
      users.push(demoUser);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }

    const { passwordHash: _, ...safeUser } = demoUser;
    this.setAuthSession(safeUser);
    return safeUser;
  },

  /**
   * Fetch current user profile from server or local session
   */
  async fetchCurrentUser() {
    const token = api.getToken();
    if (token) {
      try {
        const data = await api.get('/auth/me');
        if (data?.user) {
          this.setAuthSession(data.user);
          return data.user;
        }
      } catch (err) {
        // If token is invalid / expired, clear session
        if (err.status === 401) {
          this.clearAuthSession();
          return null;
        }
      }
    }
    return this.getAuthSession();
  },

  /**
   * Update user profile preferences in MongoDB
   */
  async updateUserProfile(profileData) {
    try {
      const data = await api.put('/auth/profile', profileData);
      if (data?.user) {
        this.setAuthSession(data.user);
        return data.user;
      }
    } catch (err) {
      console.warn('Failed to update profile on server, saving locally:', err.message);
    }

    // Offline update
    const current = this.getAuthSession() || {};
    const updated = {
      ...current,
      ...profileData
    };
    this.setAuthSession(updated);
    return updated;
  },

  /**
   * Session Management
   */
  getAuthSession() {
    try {
      const sess = localStorage.getItem(STORAGE_KEY_AUTH);
      return sess ? JSON.parse(sess) : null;
    } catch {
      return null;
    }
  },

  setAuthSession(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } else {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    }
  },

  clearAuthSession() {
    api.clearToken();
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  /**
   * Trips CRUD Layer with Multi-City Stops Support
   */
  async getTrips(userId) {
    if (!userId) return [];
    
    // 1. Try real MongoDB backend
    if (api.getToken()) {
      try {
        const data = await api.get('/trips');
        if (Array.isArray(data?.trips)) {
          // Sync trips into local storage cache
          const localAll = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
          const otherUsersTrips = localAll.filter(t => t.userId !== userId);
          localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify([...data.trips, ...otherUsersTrips]));
          return data.trips;
        }
      } catch (err) {
        console.warn('Backend /trips fetch failed, falling back to local cache:', err.message);
      }
    }

    // 2. Offline / Local fallback
    try {
      const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
      return allTrips.filter(t => t.userId === userId || t.userId === 'user-demo-1');
    } catch {
      return [];
    }
  },

  getAllTrips() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    } catch {
      return [];
    }
  },

  async getTripByShareToken(token) {
    if (!token) return null;

    // 1. Try real MongoDB backend
    try {
      const data = await api.get(`/trips/share/${token}`);
      if (data?.trip) {
        return data.trip;
      }
    } catch (err) {
      console.warn(`Backend fetch for share token ${token} failed, trying local:`, err.message);
    }

    // 2. Offline / Local fallback
    try {
      const allTrips = this.getAllTrips();
      const trip = allTrips.find(t => t.shareToken === token || t.id === token || t._id === token);
      if (!trip) return null;
      if (trip.stops && trip.stops.length > 0) {
        trip.stops.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      }
      return trip;
    } catch {
      return null;
    }
  },

  async getTripById(tripId, userId) {
    if (!tripId) return null;

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.get(`/trips/${tripId}`);
        if (data?.trip) {
          return data.trip;
        }
      } catch (err) {
        console.warn(`Backend fetch for trip ${tripId} failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => t.id === tripId || t._id === tripId);
    if (!trip) return null;
    if (trip.stops && trip.stops.length > 0) {
      trip.stops.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    }
    return trip;
  },

  async createTrip(tripData, userId) {
    if (!userId) throw new Error('User authentication required.');
    const title = (tripData.title || '').trim();
    if (!title) throw new Error('Trip title is required.');
    if (!tripData.startDate) throw new Error('Start date is required.');
    if (!tripData.endDate) throw new Error('End date is required.');

    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format.');
    }
    if (end < start) {
      throw new Error('End date cannot be earlier than start date.');
    }

    const budget = Number(tripData.totalBudget);
    if (isNaN(budget) || budget < 0) {
      throw new Error('Target budget must be a positive number.');
    }

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.post('/trips', {
          title,
          description: (tripData.description || '').trim(),
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          totalBudget: budget,
          currency: tripData.currency || 'INR',
          coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
          stops: tripData.stops || [],
          expenses: tripData.expenses || []
        });

        if (data?.trip) {
          const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
          localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify([data.trip, ...allTrips]));
          return data.trip;
        }
      } catch (err) {
        console.warn('Backend create trip failed, falling back to local:', err.message);
      }
    }

    // 2. Offline fallback
    const newTripId = `trip-${Date.now()}`;
    const formattedStops = (tripData.stops || []).map((stop, idx) => ({
      id: stop.id || `stop-${Date.now()}-${idx}`,
      tripId: newTripId,
      cityName: (stop.cityName || '').trim(),
      country: (stop.country || '').trim(),
      arrivalDate: stop.arrivalDate || tripData.startDate,
      departureDate: stop.departureDate || tripData.endDate,
      orderIndex: typeof stop.orderIndex === 'number' ? stop.orderIndex : idx,
      budgetAllocation: Number(stop.budgetAllocation) || 0,
      notes: (stop.notes || '').trim(),
      activities: stop.activities || []
    }));

    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const newTrip = {
      id: newTripId,
      userId,
      title,
      description: (tripData.description || '').trim(),
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      totalBudget: budget,
      currency: tripData.currency || 'INR',
      shareToken: `gt-share-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isPublic: true,
      stops: formattedStops,
      expenses: tripData.expenses || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newTrip, ...allTrips];
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(updated));
    return newTrip;
  },

  async updateTrip(tripId, tripData, userId) {
    if (!tripId || !userId) return null;

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.put(`/trips/${tripId}`, tripData);
        if (data?.trip) {
          const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
          const idx = allTrips.findIndex(t => t.id === tripId || t._id === tripId);
          if (idx !== -1) {
            allTrips[idx] = data.trip;
            localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
          }
          return data.trip;
        }
      } catch (err) {
        console.warn(`Backend update trip ${tripId} failed, falling back to local:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const idx = allTrips.findIndex(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (idx === -1) return null;

    allTrips[idx] = {
      ...allTrips[idx],
      ...tripData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return allTrips[idx];
  },

  async deleteTrip(tripId, userId) {
    if (!tripId || !userId) return false;

    // 1. Try real backend
    if (api.getToken()) {
      try {
        await api.delete(`/trips/${tripId}`);
      } catch (err) {
        console.warn(`Backend delete trip ${tripId} failed, removing locally:`, err.message);
      }
    }

    // 2. Offline / local update
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const filtered = allTrips.filter(t => !(t.id === tripId || t._id === tripId));
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(filtered));
    return true;
  },

  /**
   * Stops Management Layer (Hour 3)
   */
  async addStop(tripId, stopData, userId) {
    if (!tripId || !userId) throw new Error('Trip ID and user authentication required.');
    const cityName = (stopData.cityName || '').trim();
    if (!cityName) throw new Error('City name is required.');

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.post(`/trips/${tripId}/stops`, stopData);
        if (data?.stop) {
          await this.getTrips(userId); // sync cache
          return data.stop;
        }
      } catch (err) {
        console.warn('Backend addStop failed, falling back to local:', err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip) throw new Error('Trip not found.');

    if (!trip.stops) trip.stops = [];

    const newStop = {
      id: stopData.id || `stop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tripId,
      cityName,
      country: (stopData.country || '').trim(),
      arrivalDate: stopData.arrivalDate || trip.startDate,
      departureDate: stopData.departureDate || trip.endDate,
      orderIndex: trip.stops.length,
      budgetAllocation: Number(stopData.budgetAllocation) || 0,
      notes: (stopData.notes || '').trim(),
      activities: []
    };

    trip.stops.push(newStop);
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return newStop;
  },

  async updateStop(tripId, stopId, stopData, userId) {
    if (!tripId || !stopId || !userId) throw new Error('Trip ID and stop ID required.');

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.put(`/trips/${tripId}/stops/${stopId}`, stopData);
        if (data?.stop) {
          await this.getTrips(userId);
          return data.stop;
        }
      } catch (err) {
        console.warn(`Backend updateStop ${stopId} failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops) throw new Error('Trip or stops not found.');

    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop) throw new Error('Stop not found.');

    if (stopData.cityName !== undefined) stop.cityName = (stopData.cityName || '').trim();
    if (stopData.country !== undefined) stop.country = (stopData.country || '').trim();
    if (stopData.arrivalDate !== undefined) stop.arrivalDate = stopData.arrivalDate;
    if (stopData.departureDate !== undefined) stop.departureDate = stopData.departureDate;
    if (stopData.budgetAllocation !== undefined) stop.budgetAllocation = Number(stopData.budgetAllocation) || 0;
    if (stopData.notes !== undefined) stop.notes = (stopData.notes || '').trim();

    trip.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return stop;
  },

  async deleteStop(tripId, stopId, userId) {
    if (!tripId || !stopId || !userId) return false;

    // 1. Try real backend
    if (api.getToken()) {
      try {
        await api.delete(`/trips/${tripId}/stops/${stopId}`);
        await this.getTrips(userId);
        return true;
      } catch (err) {
        console.warn(`Backend deleteStop ${stopId} failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops) return false;

    trip.stops = trip.stops.filter(s => s.id !== stopId);
    trip.stops.forEach((s, idx) => {
      s.orderIndex = idx;
    });
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return true;
  },

  async moveStop(tripId, stopId, direction, userId) {
    if (!tripId || !stopId || !userId) return false;
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops || trip.stops.length < 2) return false;

    trip.stops.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    const currentIndex = trip.stops.findIndex(s => s.id === stopId);
    if (currentIndex === -1) return false;

    if (direction === 'up' && currentIndex > 0) {
      const temp = trip.stops[currentIndex];
      trip.stops[currentIndex] = trip.stops[currentIndex - 1];
      trip.stops[currentIndex - 1] = temp;
    } else if (direction === 'down' && currentIndex < trip.stops.length - 1) {
      const temp = trip.stops[currentIndex];
      trip.stops[currentIndex] = trip.stops[currentIndex + 1];
      trip.stops[currentIndex + 1] = temp;
    } else {
      return false;
    }

    const orderedIds = trip.stops.map(s => s.id);
    return await this.reorderStops(tripId, orderedIds, userId);
  },

  async reorderStops(tripId, orderedStopIds, userId) {
    if (!tripId || !orderedStopIds || !userId) return false;

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.put(`/trips/${tripId}/stops/reorder`, { orderedStopIds });
        if (data?.stops) {
          await this.getTrips(userId);
          return data.stops;
        }
      } catch (err) {
        console.warn('Backend reorderStops failed, falling back:', err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops) return false;

    const stopMap = new Map(trip.stops.map(s => [s.id, s]));
    const reordered = [];

    orderedStopIds.forEach((id, idx) => {
      const stop = stopMap.get(id);
      if (stop) {
        stop.orderIndex = idx;
        reordered.push(stop);
      }
    });

    trip.stops = reordered;
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return trip.stops;
  },

  /**
   * Activities & Experience Management Layer (Hour 4)
   */
  async addActivity(tripId, stopId, activityData, userId) {
    if (!tripId || !stopId || !userId) throw new Error('Trip ID, stop ID, and user authentication required.');
    const title = (activityData.title || '').trim();
    if (!title) throw new Error('Activity title is required.');

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData);
        if (data?.activity) {
          await this.getTrips(userId);
          return data.activity;
        }
      } catch (err) {
        console.warn('Backend addActivity failed, falling back:', err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops) throw new Error('Trip or stops not found.');

    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop) throw new Error('City stop not found.');

    if (!Array.isArray(stop.activities)) {
      stop.activities = [];
    }

    const newActivity = {
      id: activityData.id || `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      category: activityData.category || 'Sightseeing',
      cost: typeof activityData.cost === 'number' ? Math.max(0, activityData.cost) : (Number(activityData.cost) || 0),
      durationHours: typeof activityData.durationHours === 'number' ? Math.max(0.5, activityData.durationHours) : (Number(activityData.durationHours) || 1.5),
      timeSlot: activityData.timeSlot || 'Morning',
      isBooked: Boolean(activityData.isBooked),
      locationNotes: (activityData.locationNotes || '').trim()
    };

    stop.activities.push(newActivity);
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return newActivity;
  },

  async updateActivity(tripId, stopId, activityId, activityData, userId) {
    if (!tripId || !stopId || !activityId || !userId) throw new Error('Trip ID, stop ID, activity ID and user auth required.');

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.put(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, activityData);
        if (data?.activity) {
          await this.getTrips(userId);
          return data.activity;
        }
      } catch (err) {
        console.warn(`Backend updateActivity ${activityId} failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops) throw new Error('Trip or stops not found.');

    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop || !Array.isArray(stop.activities)) throw new Error('Stop or activities not found.');

    const activity = stop.activities.find(a => a.id === activityId);
    if (!activity) throw new Error('Activity not found.');

    if (activityData.title !== undefined) activity.title = (activityData.title || '').trim();
    if (activityData.category !== undefined) activity.category = activityData.category;
    if (activityData.cost !== undefined) activity.cost = Math.max(0, Number(activityData.cost) || 0);
    if (activityData.durationHours !== undefined) activity.durationHours = Math.max(0.25, Number(activityData.durationHours) || 1);
    if (activityData.timeSlot !== undefined) activity.timeSlot = activityData.timeSlot;
    if (activityData.isBooked !== undefined) activity.isBooked = Boolean(activityData.isBooked);
    if (activityData.locationNotes !== undefined) activity.locationNotes = (activityData.locationNotes || '').trim();

    trip.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return activity;
  },

  async deleteActivity(tripId, stopId, activityId, userId) {
    if (!tripId || !stopId || !activityId || !userId) return false;

    // 1. Try real backend
    if (api.getToken()) {
      try {
        await api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`);
        await this.getTrips(userId);
        return true;
      } catch (err) {
        console.warn(`Backend deleteActivity ${activityId} failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops) return false;

    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop || !Array.isArray(stop.activities)) return false;

    stop.activities = stop.activities.filter(a => a.id !== activityId);
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return true;
  },

  async toggleActivityBooking(tripId, stopId, activityId, userId) {
    if (!tripId || !stopId || !activityId || !userId) throw new Error('Missing parameters to toggle booking.');

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.patch(`/trips/${tripId}/stops/${stopId}/activities/${activityId}/toggle-booking`);
        if (data?.activity) {
          await this.getTrips(userId);
          return data.activity;
        }
      } catch (err) {
        console.warn(`Backend toggle booking failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !trip.stops) throw new Error('Trip or stops not found.');

    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop || !Array.isArray(stop.activities)) throw new Error('Stop or activities not found.');

    const activity = stop.activities.find(a => a.id === activityId);
    if (!activity) throw new Error('Activity not found.');

    activity.isBooked = !activity.isBooked;
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return activity;
  },

  /**
   * Interactive Budget & Expense Management Layer (Hour 5)
   */
  async addExpense(tripId, expenseData, userId) {
    if (!tripId || !userId) throw new Error('Trip ID and user authentication required.');
    const amount = Number(expenseData.amount);
    if (isNaN(amount) || amount < 0) {
      throw new Error('Expense amount must be a positive number.');
    }

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.post(`/trips/${tripId}/expenses`, expenseData);
        if (data?.expense) {
          await this.getTrips(userId);
          return data.expense;
        }
      } catch (err) {
        console.warn('Backend addExpense failed, falling back:', err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip) throw new Error('Trip not found.');

    if (!Array.isArray(trip.expenses)) {
      trip.expenses = [];
    }

    const newExpense = {
      id: expenseData.id || `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tripId,
      category: expenseData.category || 'Misc',
      amount: Math.max(0, amount),
      currency: expenseData.currency || trip.currency || 'INR',
      note: (expenseData.note || '').trim(),
      date: expenseData.date || new Date().toISOString().split('T')[0],
      paymentMethod: expenseData.paymentMethod || 'Credit Card',
      cityStopId: expenseData.cityStopId || null,
      createdAt: new Date().toISOString()
    };

    trip.expenses.unshift(newExpense);
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return newExpense;
  },

  async updateExpense(tripId, expenseId, expenseData, userId) {
    if (!tripId || !expenseId || !userId) throw new Error('Trip ID, expense ID, and user authentication required.');

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const data = await api.put(`/trips/${tripId}/expenses/${expenseId}`, expenseData);
        if (data?.expense) {
          await this.getTrips(userId);
          return data.expense;
        }
      } catch (err) {
        console.warn(`Backend updateExpense ${expenseId} failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !Array.isArray(trip.expenses)) throw new Error('Trip or expenses not found.');

    const expense = trip.expenses.find(e => e.id === expenseId);
    if (!expense) throw new Error('Expense not found.');

    if (expenseData.category !== undefined) expense.category = expenseData.category;
    if (expenseData.amount !== undefined) expense.amount = Math.max(0, Number(expenseData.amount) || 0);
    if (expenseData.currency !== undefined) expense.currency = expenseData.currency;
    if (expenseData.note !== undefined) expense.note = (expenseData.note || '').trim();
    if (expenseData.date !== undefined) expense.date = expenseData.date;
    if (expenseData.paymentMethod !== undefined) expense.paymentMethod = expenseData.paymentMethod;
    if (expenseData.cityStopId !== undefined) expense.cityStopId = expenseData.cityStopId || null;

    trip.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return expense;
  },

  async deleteExpense(tripId, expenseId, userId) {
    if (!tripId || !expenseId || !userId) return false;

    // 1. Try real backend
    if (api.getToken()) {
      try {
        await api.delete(`/trips/${tripId}/expenses/${expenseId}`);
        await this.getTrips(userId);
        return true;
      } catch (err) {
        console.warn(`Backend deleteExpense ${expenseId} failed, falling back:`, err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip || !Array.isArray(trip.expenses)) return false;

    trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return true;
  },

  async setTripBudget(tripId, totalBudget, currency, userId) {
    if (!tripId || !userId) throw new Error('Trip ID and user authentication required.');
    const budget = Number(totalBudget);
    if (isNaN(budget) || budget < 0) {
      throw new Error('Total budget must be a positive number.');
    }

    // 1. Try real backend
    if (api.getToken()) {
      try {
        const payload = { totalBudget: budget };
        if (currency) payload.currency = currency;
        const data = await api.patch(`/trips/${tripId}/budget`, payload);
        if (data?.trip) {
          await this.getTrips(userId);
          return data.trip;
        }
      } catch (err) {
        console.warn('Backend setTripBudget failed, falling back:', err.message);
      }
    }

    // 2. Offline fallback
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => (t.id === tripId || t._id === tripId) && (t.userId === userId || t.userId === 'user-demo-1'));
    if (!trip) throw new Error('Trip not found.');

    trip.totalBudget = budget;
    if (currency) trip.currency = currency;
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return trip;
  }
};

