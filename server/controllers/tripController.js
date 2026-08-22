const Trip = require("../models/Trip");

const formatTrip = (trip) => {
  const obj = trip.toObject ? trip.toObject() : trip;
  return {
    ...obj,
    id: obj._id ? obj._id.toString() : obj.id,
    userId: obj.userId ? obj.userId.toString() : obj.userId,
  };
};

const getTrips = async (req, res) => {
  try {
    let trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // If demo account and trips are empty, seed initial voyages
    if (trips.length === 0 && req.user.email === "demo@globetrotter.io") {
      const demoVoyages = [
        {
          userId: req.user._id,
          title: "Gujarat Coastal Expedition: Ahmedabad to Daman",
          description: "A scenic heritage and coastal voyage across Western India with Portuguese architecture, beach sunsets, and local culinary delights.",
          startDate: "2026-05-10",
          endDate: "2026-05-15",
          totalBudget: 45000,
          currency: "INR",
          coverImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
          shareToken: `gt-share-${Date.now()}-daman`,
          isPublic: true,
          stops: [
            {
              id: "stop-ahmedabad-1",
              cityName: "Ahmedabad",
              country: "India",
              arrivalDate: "2026-05-10",
              departureDate: "2026-05-12",
              orderIndex: 0,
              budgetAllocation: 20000,
              notes: "Heritage walk in Old City, Sabarmati Ashram, and Manek Chowk night food market.",
              activities: [
                {
                  id: "act-ahm-1",
                  title: "Sabarmati Ashram & Riverfront Walk",
                  category: "Culture",
                  cost: 200,
                  durationHours: 3,
                  timeSlot: "Morning",
                  isBooked: true,
                  locationNotes: "Historic Gandhi Ashram by the Sabarmati River"
                },
                {
                  id: "act-ahm-2",
                  title: "Manek Chowk Street Food Tour",
                  category: "Food & Dining",
                  cost: 1200,
                  durationHours: 2.5,
                  timeSlot: "Evening",
                  isBooked: false,
                  locationNotes: "Famous night market with Gwalior dosa & kulfi"
                }
              ]
            },
            {
              id: "stop-daman-2",
              cityName: "Daman",
              country: "India",
              arrivalDate: "2026-05-12",
              departureDate: "2026-05-15",
              orderIndex: 1,
              budgetAllocation: 25000,
              notes: "St. Jerome Fort, Devka Beach sunset, and Portuguese seafood cuisine.",
              activities: [
                {
                  id: "act-daman-1",
                  title: "Moti Daman & St. Jerome Fort Exploration",
                  category: "Sightseeing",
                  cost: 150,
                  durationHours: 3,
                  timeSlot: "Morning",
                  isBooked: true,
                  locationNotes: "16th-century Portuguese fortress facing the Arabian Sea"
                },
                {
                  id: "act-daman-2",
                  title: "Devka Beach Sunset & Coastal Seafood Dinner",
                  category: "Food & Dining",
                  cost: 2200,
                  durationHours: 3,
                  timeSlot: "Evening",
                  isBooked: false,
                  locationNotes: "Fresh pomfret fry & prawn curry by the seaside"
                },
                {
                  id: "act-daman-3",
                  title: "Jampore Beach Water Sports & Relaxation",
                  category: "Adventure",
                  cost: 1800,
                  durationHours: 4,
                  timeSlot: "Afternoon",
                  isBooked: true,
                  locationNotes: "Jet skiing and parasailing on tranquil black-sand beach"
                }
              ]
            }
          ],
          expenses: [
            {
              id: "exp-1",
              category: "Transport",
              amount: 3200,
              currency: "INR",
              note: "Vande Bharat Express Train (Ahmedabad to Vapi/Daman)",
              date: "2026-05-12",
              paymentMethod: "Credit Card",
              cityStopId: "stop-ahmedabad-1"
            },
            {
              id: "exp-2",
              category: "Accommodation",
              amount: 14000,
              currency: "INR",
              note: "The Deltin Hotel & Resort Daman (3 Nights)",
              date: "2026-05-12",
              paymentMethod: "Credit Card",
              cityStopId: "stop-daman-2"
            },
            {
              id: "exp-3",
              category: "Food & Dining",
              amount: 3500,
              currency: "INR",
              note: "Heritage Gujarati Thali & Coastal Seafood",
              date: "2026-05-13",
              paymentMethod: "Digital / Apple Pay",
              cityStopId: "stop-daman-2"
            }
          ]
        }
      ];

      trips = await Trip.create(demoVoyages);
    }

    return res.json({
      trips: trips.map(formatTrip),
    });
  } catch (error) {
    console.error("Get trips error:", error);
    return res.status(500).json({ message: "Failed to fetch trips." });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    return res.json({ trip: formatTrip(trip) });
  } catch (error) {
    console.error("Get trip by id error:", error);
    return res.status(500).json({ message: "Failed to fetch trip." });
  }
};

const createTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      totalBudget,
      currency,
      coverImage,
      stops,
      expenses,
      isPublic,
    } = req.body;

    if (!title?.trim() || !startDate || !endDate) {
      return res.status(400).json({
        message: "Title, start date, and end date are required.",
      });
    }

    const shareToken = `gt-share-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Ensure stops and activities have valid IDs
    const sanitizedStops = (stops || []).map((stop, sIdx) => ({
      id: stop.id || `stop-${Date.now()}-${sIdx}`,
      cityName: stop.cityName,
      country: stop.country || "",
      arrivalDate: stop.arrivalDate || startDate,
      departureDate: stop.departureDate || endDate,
      orderIndex: typeof stop.orderIndex === "number" ? stop.orderIndex : sIdx,
      budgetAllocation: Number(stop.budgetAllocation) || 0,
      notes: stop.notes || "",
      activities: (stop.activities || []).map((act, aIdx) => ({
        id: act.id || `act-${Date.now()}-${sIdx}-${aIdx}`,
        title: act.title,
        category: act.category || "Sightseeing",
        cost: Number(act.cost) || 0,
        durationHours: Number(act.durationHours) || 2,
        timeSlot: act.timeSlot || "Morning",
        isBooked: Boolean(act.isBooked),
        locationNotes: act.locationNotes || "",
      })),
    }));

    const sanitizedExpenses = (expenses || []).map((exp, eIdx) => ({
      id: exp.id || `exp-${Date.now()}-${eIdx}`,
      category: exp.category || "Misc",
      amount: Number(exp.amount) || 0,
      currency: exp.currency || currency || "INR",
      note: exp.note || "",
      date: exp.date || startDate,
      paymentMethod: exp.paymentMethod || "Credit Card",
      cityStopId: exp.cityStopId || null,
      createdAt: exp.createdAt || new Date().toISOString(),
    }));

    const trip = await Trip.create({
      userId: req.user._id,
      title: title.trim(),
      description: (description || "").trim(),
      startDate,
      endDate,
      totalBudget: Number(totalBudget) || 0,
      currency: currency || req.user.preferredCurrency || "INR",
      coverImage: coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      shareToken,
      isPublic: isPublic !== undefined ? isPublic : true,
      stops: sanitizedStops,
      expenses: sanitizedExpenses,
    });

    return res.status(201).json({ trip: formatTrip(trip) });
  } catch (error) {
    console.error("Create trip error:", error);
    return res.status(500).json({ message: "Failed to create trip." });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      totalBudget,
      currency,
      coverImage,
      stops,
      expenses,
      isPublic,
    } = req.body;

    if (title !== undefined) trip.title = title.trim();
    if (description !== undefined) trip.description = description.trim();
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;
    if (totalBudget !== undefined) trip.totalBudget = Number(totalBudget) || 0;
    if (currency !== undefined) trip.currency = currency;
    if (coverImage !== undefined) trip.coverImage = coverImage;
    if (isPublic !== undefined) trip.isPublic = Boolean(isPublic);
    if (Array.isArray(stops)) trip.stops = stops;
    if (Array.isArray(expenses)) trip.expenses = expenses;

    await trip.save();

    return res.json({ trip: formatTrip(trip) });
  } catch (error) {
    console.error("Update trip error:", error);
    return res.status(500).json({ message: "Failed to update trip." });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    return res.json({ success: true, message: "Trip deleted successfully." });
  } catch (error) {
    console.error("Delete trip error:", error);
    return res.status(500).json({ message: "Failed to delete trip." });
  }
};

const getPublicTripByShareToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Share token required." });
    }

    const query = {
      $or: [{ shareToken: token }],
      isPublic: true,
    };

    if (token.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: token });
    }

    const trip = await Trip.findOne(query).populate("userId", "name avatar");

    if (!trip) {
      return res.status(404).json({ message: "Shared itinerary not found or has been set to private." });
    }

    const formatted = formatTrip(trip);
    if (trip.userId && typeof trip.userId === "object") {
      formatted.creatorName = trip.userId.name;
      formatted.creatorAvatar = trip.userId.avatar;
    }

    return res.json({ trip: formatted });
  } catch (error) {
    console.error("Get public trip error:", error);
    return res.status(500).json({ message: "Failed to load shared trip." });
  }
};

const addStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { cityName, country, arrivalDate, departureDate, budgetAllocation, notes } = req.body;

    if (!cityName?.trim()) {
      return res.status(400).json({ message: "City name is required." });
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const newStop = {
      id: `stop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cityName: cityName.trim(),
      country: (country || "").trim(),
      arrivalDate: arrivalDate || trip.startDate,
      departureDate: departureDate || trip.endDate,
      orderIndex: trip.stops.length,
      budgetAllocation: Number(budgetAllocation) || 0,
      notes: (notes || "").trim(),
      activities: [],
    };

    trip.stops.push(newStop);
    await trip.save();

    return res.status(201).json({ stop: newStop, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Add stop error:", error);
    return res.status(500).json({ message: "Failed to add city stop." });
  }
};

const updateStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { cityName, country, arrivalDate, departureDate, budgetAllocation, notes } = req.body;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const stop = trip.stops.find((s) => s.id === stopId);
    if (!stop) {
      return res.status(404).json({ message: "Stop not found." });
    }

    if (cityName !== undefined) stop.cityName = cityName.trim();
    if (country !== undefined) stop.country = country.trim();
    if (arrivalDate !== undefined) stop.arrivalDate = arrivalDate;
    if (departureDate !== undefined) stop.departureDate = departureDate;
    if (budgetAllocation !== undefined) stop.budgetAllocation = Number(budgetAllocation) || 0;
    if (notes !== undefined) stop.notes = notes.trim();

    await trip.save();

    return res.json({ stop, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Update stop error:", error);
    return res.status(500).json({ message: "Failed to update city stop." });
  }
};

const deleteStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    trip.stops = trip.stops.filter((s) => s.id !== stopId);
    trip.stops.forEach((s, idx) => {
      s.orderIndex = idx;
    });

    // Also remove any expenses associated with this city stop
    trip.expenses = trip.expenses.filter((e) => e.cityStopId !== stopId);

    await trip.save();

    return res.json({ success: true, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Delete stop error:", error);
    return res.status(500).json({ message: "Failed to delete city stop." });
  }
};

const reorderStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { orderedStopIds } = req.body;

    if (!Array.isArray(orderedStopIds)) {
      return res.status(400).json({ message: "orderedStopIds array required." });
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const stopMap = new Map();
    trip.stops.forEach((s) => stopMap.set(s.id, s));

    const newStops = [];
    orderedStopIds.forEach((id, idx) => {
      const stop = stopMap.get(id);
      if (stop) {
        stop.orderIndex = idx;
        newStops.push(stop);
        stopMap.delete(id);
      }
    });

    // Append any remaining stops
    stopMap.forEach((stop) => {
      stop.orderIndex = newStops.length;
      newStops.push(stop);
    });

    trip.stops = newStops;
    await trip.save();

    return res.json({ stops: trip.stops, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Reorder stops error:", error);
    return res.status(500).json({ message: "Failed to reorder stops." });
  }
};

// Activity Management Handlers
const addActivity = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { title, category, cost, durationHours, timeSlot, isBooked, locationNotes } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Activity title is required." });
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const stop = trip.stops.find((s) => s.id === stopId);
    if (!stop) {
      return res.status(404).json({ message: "Stop not found." });
    }

    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      category: category || "Sightseeing",
      cost: Number(cost) || 0,
      durationHours: Number(durationHours) || 2,
      timeSlot: timeSlot || "Morning",
      isBooked: Boolean(isBooked),
      locationNotes: (locationNotes || "").trim(),
    };

    if (!Array.isArray(stop.activities)) {
      stop.activities = [];
    }

    stop.activities.push(newActivity);
    await trip.save();

    return res.status(201).json({ activity: newActivity, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Add activity error:", error);
    return res.status(500).json({ message: "Failed to add activity." });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const { title, category, cost, durationHours, timeSlot, isBooked, locationNotes } = req.body;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const stop = trip.stops.find((s) => s.id === stopId);
    if (!stop || !Array.isArray(stop.activities)) {
      return res.status(404).json({ message: "Stop or activities not found." });
    }

    const activity = stop.activities.find((a) => a.id === activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    if (title !== undefined) activity.title = title.trim();
    if (category !== undefined) activity.category = category;
    if (cost !== undefined) activity.cost = Number(cost) || 0;
    if (durationHours !== undefined) activity.durationHours = Number(durationHours) || 2;
    if (timeSlot !== undefined) activity.timeSlot = timeSlot;
    if (isBooked !== undefined) activity.isBooked = Boolean(isBooked);
    if (locationNotes !== undefined) activity.locationNotes = (locationNotes || "").trim();

    await trip.save();

    return res.json({ activity, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Update activity error:", error);
    return res.status(500).json({ message: "Failed to update activity." });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const stop = trip.stops.find((s) => s.id === stopId);
    if (!stop || !Array.isArray(stop.activities)) {
      return res.status(404).json({ message: "Stop or activities not found." });
    }

    stop.activities = stop.activities.filter((a) => a.id !== activityId);
    await trip.save();

    return res.json({ success: true, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Delete activity error:", error);
    return res.status(500).json({ message: "Failed to remove activity." });
  }
};

const toggleActivityBooking = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const stop = trip.stops.find((s) => s.id === stopId);
    if (!stop || !Array.isArray(stop.activities)) {
      return res.status(404).json({ message: "Stop or activities not found." });
    }

    const activity = stop.activities.find((a) => a.id === activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    activity.isBooked = !activity.isBooked;
    await trip.save();

    return res.json({ activity, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Toggle activity booking error:", error);
    return res.status(500).json({ message: "Failed to toggle booking." });
  }
};

const addExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, amount, currency, note, date, paymentMethod, cityStopId } = req.body;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      return res.status(400).json({ message: "Valid positive expense amount required." });
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    const newExpense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: category || "Misc",
      amount: numAmount,
      currency: currency || trip.currency || "INR",
      note: (note || "").trim(),
      date: date || new Date().toISOString().split("T")[0],
      paymentMethod: paymentMethod || "Credit Card",
      cityStopId: cityStopId || null,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(trip.expenses)) {
      trip.expenses = [];
    }

    trip.expenses.push(newExpense);
    await trip.save();

    return res.status(201).json({ expense: newExpense, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Add expense error:", error);
    return res.status(500).json({ message: "Failed to log expense." });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    const { category, amount, currency, note, date, paymentMethod, cityStopId } = req.body;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip || !Array.isArray(trip.expenses)) {
      return res.status(404).json({ message: "Trip or expenses not found." });
    }

    const expense = trip.expenses.find((e) => e.id === expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    if (category !== undefined) expense.category = category;
    if (amount !== undefined) expense.amount = Math.max(0, Number(amount) || 0);
    if (currency !== undefined) expense.currency = currency;
    if (note !== undefined) expense.note = (note || "").trim();
    if (date !== undefined) expense.date = date;
    if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
    if (cityStopId !== undefined) expense.cityStopId = cityStopId || null;

    await trip.save();

    return res.json({ expense, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Update expense error:", error);
    return res.status(500).json({ message: "Failed to update expense." });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip || !Array.isArray(trip.expenses)) {
      return res.status(404).json({ message: "Trip or expenses not found." });
    }

    trip.expenses = trip.expenses.filter((e) => e.id !== expenseId);
    await trip.save();

    return res.json({ success: true, trip: formatTrip(trip) });
  } catch (error) {
    console.error("Delete expense error:", error);
    return res.status(500).json({ message: "Failed to delete expense." });
  }
};

const setTripBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { totalBudget, currency } = req.body;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized." });
    }

    if (totalBudget !== undefined) {
      trip.totalBudget = Math.max(0, Number(totalBudget) || 0);
    }
    if (currency !== undefined) {
      trip.currency = currency;
    }

    await trip.save();

    return res.json({ trip: formatTrip(trip) });
  } catch (error) {
    console.error("Set budget error:", error);
    return res.status(500).json({ message: "Failed to update trip budget." });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getPublicTripByShareToken,
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
  addActivity,
  updateActivity,
  deleteActivity,
  toggleActivityBooking,
  addExpense,
  updateExpense,
  deleteExpense,
  setTripBudget,
};
