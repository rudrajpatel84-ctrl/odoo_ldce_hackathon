export const budgetService = {
  formatCurrency(amount, currency = 'USD') {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'CA$',
      AUD: 'A$'
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  },

  calculateTripBudget(trip) {
    if (!trip) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        remainingBudget: 0,
        percentUsed: 0,
        isOverBudget: false,
        categoryBreakdown: {},
        cityBreakdown: []
      };
    }

    const totalBudget = Number(trip.totalBudget) || 0;
    const expenses = trip.expenses || [];

    // Sum expenses
    const totalSpent = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const remainingBudget = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
    const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

    // Category Aggregation
    const categoryTotals = {
      Stay: 0,
      Food: 0,
      Sightseeing: 0,
      Transport: 0,
      Activity: 0,
      Other: 0
    };

    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += Number(exp.amount) || 0;
      } else {
        categoryTotals['Other'] += Number(exp.amount) || 0;
      }
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // City Breakdown
    const cityBreakdown = (trip.stops || []).map(stop => {
      const stopActivities = stop.activities || [];
      const activityCostSum = stopActivities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
      const stopExpensesSum = expenses
        .filter(e => e.tripStopId === stop.id)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const totalForStop = Math.max(activityCostSum, stopExpensesSum);
      const allocated = Number(stop.budgetAllocation) || 0;

      return {
        stopId: stop.id,
        cityName: stop.cityName,
        country: stop.country,
        allocated,
        spent: totalForStop,
        remaining: allocated - totalForStop,
        percentOfAllocation: allocated > 0 ? Math.round((totalForStop / allocated) * 100) : 0
      };
    });

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      percentUsed,
      isOverBudget,
      categoryBreakdown,
      cityBreakdown
    };
  }
};
