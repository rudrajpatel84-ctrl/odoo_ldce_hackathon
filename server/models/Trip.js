const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Sightseeing", "Food & Dining", "Culture", "Adventure", "Relaxation"],
      default: "Sightseeing",
    },
    cost: { type: Number, default: 0 },
    durationHours: { type: Number, default: 2 },
    timeSlot: { type: String, default: "Morning" },
    isBooked: { type: Boolean, default: false },
    locationNotes: { type: String, default: "" },
  },
  { _id: false }
);

const stopSchema = new mongoose.Schema(
  {
    id: { type: String },
    cityName: { type: String, required: true, trim: true },
    country: { type: String, default: "", trim: true },
    arrivalDate: { type: String, default: "" },
    departureDate: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 },
    budgetAllocation: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    activities: [activitySchema],
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    id: { type: String },
    category: {
      type: String,
      enum: ["Accommodation", "Transport", "Food & Dining", "Activities", "Shopping", "Misc"],
      default: "Misc",
    },
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "INR" },
    note: { type: String, default: "", trim: true },
    date: { type: String, default: "" },
    paymentMethod: { type: String, default: "Credit Card" },
    cityStopId: { type: String, default: null },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    totalBudget: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    stops: [stopSchema],
    expenses: [expenseSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
