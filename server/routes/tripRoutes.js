const express = require("express");
const {
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
} = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: accessible without login
router.get("/share/:token", getPublicTripByShareToken);

// Protected routes: require JWT token
router.use(authMiddleware);

router.get("/", getTrips);
router.post("/", createTrip);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

// Stop Management Routes
router.post("/:tripId/stops", addStop);
router.put("/:tripId/stops/reorder", reorderStops);
router.put("/:tripId/stops/:stopId", updateStop);
router.delete("/:tripId/stops/:stopId", deleteStop);

// Activity Management Routes
router.post("/:tripId/stops/:stopId/activities", addActivity);
router.put("/:tripId/stops/:stopId/activities/:activityId", updateActivity);
router.delete("/:tripId/stops/:stopId/activities/:activityId", deleteActivity);
router.patch("/:tripId/stops/:stopId/activities/:activityId/toggle-booking", toggleActivityBooking);

// Expense & Budget Management Routes
router.post("/:tripId/expenses", addExpense);
router.put("/:tripId/expenses/:expenseId", updateExpense);
router.delete("/:tripId/expenses/:expenseId", deleteExpense);
router.patch("/:tripId/budget", setTripBudget);

module.exports = router;
