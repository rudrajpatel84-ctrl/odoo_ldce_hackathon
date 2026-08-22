import { hashPassword, verifyPassword } from './crypto';
import { INITIAL_TRIPS } from './mockData';

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

    // 2. Relational Trips Table - Seed with demo multi-city voyages if empty
    const existingTrips = localStorage.getItem(STORAGE_KEY_TRIPS);
    if (!existingTrips || JSON.parse(existingTrips).length === 0) {
      const seededTrips = INITIAL_TRIPS.map(t => ({
        ...t,
        userId: 'user-demo-1',
        stops: (t.stops || []).map((s, idx) => ({
          ...s,
          orderIndex: typeof s.orderIndex === 'number' ? s.orderIndex : idx
        }))
      }));
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(seededTrips));
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
   * Register a new user with hashed password (no plaintext storage)
   */
  async registerUser({ name, email, password }) {
    await this.init();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanEmail) throw new Error('Email address is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    // Hash password with SHA-256
    const passwordHash = await hashPassword(password);

    const newUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name: cleanName || cleanEmail.split('@')[0],
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    // Return safe user object (exclude passwordHash)
    const { passwordHash: _, ...safeUser } = newUser;
    this.setAuthSession(safeUser);
    return safeUser;
  },

  /**
   * Authenticate a user by verifying hashed password
   */
  async authenticateUser({ email, password }) {
    await this.init();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) throw new Error('Email address is required.');
    if (!password) throw new Error('Password is required.');

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // Verify hash
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    // Return safe user object (exclude passwordHash)
    const { passwordHash: _, ...safeUser } = user;
    this.setAuthSession(safeUser);
    return safeUser;
  },

  /**
   * 1-Click Demo Login for Evaluators & Judges
   */
  async getDemoUser() {
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
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  /**
   * Trips CRUD Layer with Multi-City Stops Support
   */
  getTrips(userId) {
    if (!userId) return [];
    try {
      const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
      return allTrips.filter(t => t.userId === userId);
    } catch {
      return [];
    }
  },

  getTripById(tripId, userId) {
    if (!tripId || !userId) return null;
    const trips = this.getTrips(userId);
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return null;
    // Ensure stops are sorted by orderIndex
    if (trip.stops && trip.stops.length > 0) {
      trip.stops.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    }
    return trip;
  },

  createTrip(tripData, userId) {
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

    const newTripId = `trip-${Date.now()}`;

    // Format stops if passed from multi-city form
    const formattedStops = (tripData.stops || []).map((stop, idx) => ({
      id: stop.id || `stop-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
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
      currency: tripData.currency || 'USD',
      shareToken: `gt-share-${Math.random().toString(36).substring(2, 9)}`,
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

  updateTrip(tripId, tripData, userId) {
    if (!tripId || !userId) return null;
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const idx = allTrips.findIndex(t => t.id === tripId && t.userId === userId);
    if (idx === -1) return null;

    allTrips[idx] = {
      ...allTrips[idx],
      ...tripData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return allTrips[idx];
  },

  deleteTrip(tripId, userId) {
    if (!tripId || !userId) return false;
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const filtered = allTrips.filter(t => !(t.id === tripId && t.userId === userId));
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(filtered));
    return true;
  },

  /**
   * Stops Management Layer (Hour 3)
   */
  addStop(tripId, stopData, userId) {
    if (!tripId || !userId) throw new Error('Trip ID and user authentication required.');
    const cityName = (stopData.cityName || '').trim();
    if (!cityName) throw new Error('City name is required.');

    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => t.id === tripId && t.userId === userId);
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

  updateStop(tripId, stopId, stopData, userId) {
    if (!tripId || !stopId || !userId) throw new Error('Trip ID and stop ID required.');
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => t.id === tripId && t.userId === userId);
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

  deleteStop(tripId, stopId, userId) {
    if (!tripId || !stopId || !userId) return false;
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => t.id === tripId && t.userId === userId);
    if (!trip || !trip.stops) return false;

    trip.stops = trip.stops.filter(s => s.id !== stopId);
    // Re-index order
    trip.stops.forEach((s, idx) => {
      s.orderIndex = idx;
    });
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return true;
  },

  moveStop(tripId, stopId, direction, userId) {
    if (!tripId || !stopId || !userId) return false;
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => t.id === tripId && t.userId === userId);
    if (!trip || !trip.stops || trip.stops.length < 2) return false;

    // Ensure sorted
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

    // Re-index order
    trip.stops.forEach((s, idx) => {
      s.orderIndex = idx;
    });
    trip.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
    return trip.stops;
  },

  reorderStops(tripId, orderedStopIds, userId) {
    if (!tripId || !orderedStopIds || !userId) return false;
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const trip = allTrips.find(t => t.id === tripId && t.userId === userId);
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
  }
};

