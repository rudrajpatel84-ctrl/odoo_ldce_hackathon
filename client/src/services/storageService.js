import { hashPassword, verifyPassword } from './crypto';

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
   * Initializes relational tables and seeds demo account if empty.
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

    // 2. Relational Tables for upcoming milestones
    if (!localStorage.getItem(STORAGE_KEY_TRIPS)) {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify([]));
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
   * Trips CRUD Layer for Hour 2
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
    return trips.find(t => t.id === tripId) || null;
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

    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId,
      title,
      description: (tripData.description || '').trim(),
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      totalBudget: budget,
      currency: tripData.currency || 'USD',
      shareToken: `gt-share-${Math.random().toString(36).substring(2, 9)}`,
      isPublic: true,
      stops: [],
      expenses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newTrip, ...allTrips];
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(updated));
    return newTrip;
  },

  deleteTrip(tripId, userId) {
    if (!tripId || !userId) return false;
    const allTrips = JSON.parse(localStorage.getItem(STORAGE_KEY_TRIPS) || '[]');
    const filtered = allTrips.filter(t => !(t.id === tripId && t.userId === userId));
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(filtered));
    return true;
  }
};
