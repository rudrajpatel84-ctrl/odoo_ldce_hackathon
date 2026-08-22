import { api } from './api';

const DEFAULT_RATES = {
  USD: 1.0,
  INR: 86.85,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 154.5,
  CAD: 1.38,
  AUD: 1.52
};

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$'
};

let cachedRates = { ...DEFAULT_RATES };
let lastRatesFetchTime = 0;

export const budgetService = {
  /**
   * Fetch live exchange rates from backend or fallback
   */
  async fetchLiveRates() {
    const now = Date.now();
    // Cache for 10 minutes
    if (now - lastRatesFetchTime < 600000 && Object.keys(cachedRates).length > 0) {
      return cachedRates;
    }

    try {
      const data = await api.get('/currency/rates');
      if (data?.rates) {
        cachedRates = { ...DEFAULT_RATES, ...data.rates };
        lastRatesFetchTime = now;
      }
    } catch (err) {
      console.warn('Using cached exchange rates:', err.message);
    }
    return cachedRates;
  },

  /**
   * Convert currency using current exchange rates
   */
  convertCurrency(amount, fromCurrency = 'USD', toCurrency = 'USD') {
    const num = Number(amount) || 0;
    if (fromCurrency === toCurrency || num === 0) return num;

    const fromRate = cachedRates[fromCurrency] || DEFAULT_RATES[fromCurrency] || 1.0;
    const toRate = cachedRates[toCurrency] || DEFAULT_RATES[toCurrency] || 1.0;

    // Convert from -> USD -> to
    const amountInUSD = num / fromRate;
    const converted = amountInUSD * toRate;

    return Math.round(converted * 100) / 100;
  },

  /**
   * Format currency with localized symbol
   */
  formatCurrency(amount, currency = 'INR') {
    const symbol = CURRENCY_SYMBOLS[currency] || (currency + ' ');
    const num = Number(amount || 0);

    // For JPY or large integer currencies without decimals
    const maxDecimals = currency === 'JPY' ? 0 : 2;
    const formatted = num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals
    });

    return `${symbol}${formatted}`;
  },

  /**
   * Calculate comprehensive budget, expenses, category breakdown, and city allocations
   */
  calculateTripBudget(trip, targetDisplayCurrency = null) {
    if (!trip) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        remainingBudget: 0,
        percentUsed: 0,
        isOverBudget: false,
        displayCurrency: 'INR',
        categoryBreakdown: [],
        cityBreakdown: []
      };
    }

    const baseCurrency = trip.currency || 'INR';
    const displayCurrency = targetDisplayCurrency || baseCurrency;

    // Convert base trip target budget to display currency
    const rawBudget = Number(trip.totalBudget) || 0;
    const totalBudget = this.convertCurrency(rawBudget, baseCurrency, displayCurrency);

    const expenses = trip.expenses || [];
    const stops = trip.stops || [];

    // Sum manual expenses converted to display currency
    let manualExpensesTotal = 0;
    const categoryTotals = {
      Accommodation: 0,
      Transport: 0,
      'Food & Dining': 0,
      Activities: 0,
      Shopping: 0,
      Misc: 0
    };

    expenses.forEach((exp) => {
      const expCurrency = exp.currency || baseCurrency;
      const convertedAmt = this.convertCurrency(Number(exp.amount) || 0, expCurrency, displayCurrency);
      manualExpensesTotal += convertedAmt;

      const cat = exp.category || 'Misc';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += convertedAmt;
      } else {
        categoryTotals['Misc'] += convertedAmt;
      }
    });

    // Also factor in booked activity costs if not already logged as separate expenses
    let bookedActivitiesCost = 0;
    stops.forEach((stop) => {
      (stop.activities || []).forEach((act) => {
        if (act.isBooked && Number(act.cost) > 0) {
          const actConverted = this.convertCurrency(Number(act.cost) || 0, baseCurrency, displayCurrency);
          bookedActivitiesCost += actConverted;
          categoryTotals['Activities'] = (categoryTotals['Activities'] || 0) + actConverted;
        }
      });
    });

    const totalSpent = manualExpensesTotal + bookedActivitiesCost;
    const remainingBudget = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
    const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

    const categoryBreakdown = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount),
        percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // City Breakdown
    const cityBreakdown = stops.map((stop) => {
      const stopActivities = stop.activities || [];
      const activityCostSum = stopActivities.reduce((sum, a) => {
        return sum + this.convertCurrency(Number(a.cost) || 0, baseCurrency, displayCurrency);
      }, 0);

      const stopExpensesSum = expenses
        .filter((e) => e.cityStopId === stop.id || e.tripStopId === stop.id)
        .reduce((sum, e) => {
          return sum + this.convertCurrency(Number(e.amount) || 0, e.currency || baseCurrency, displayCurrency);
        }, 0);

      const totalForStop = Math.max(activityCostSum, stopExpensesSum);
      const rawAllocated = Number(stop.budgetAllocation) || 0;
      const allocated = this.convertCurrency(rawAllocated, baseCurrency, displayCurrency);

      return {
        stopId: stop.id,
        cityName: stop.cityName,
        country: stop.country,
        allocated: Math.round(allocated),
        spent: Math.round(totalForStop),
        remaining: Math.round(allocated - totalForStop),
        percentOfAllocation: allocated > 0 ? Math.round((totalForStop / allocated) * 100) : 0
      };
    });

    return {
      totalBudget: Math.round(totalBudget),
      totalSpent: Math.round(totalSpent),
      remainingBudget: Math.round(remainingBudget),
      percentUsed,
      isOverBudget,
      displayCurrency,
      categoryBreakdown,
      cityBreakdown
    };
  }
};
