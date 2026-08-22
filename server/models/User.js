const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    preferredCurrency: {
      type: String,
      default: "INR",
    },

    avatar: {
      type: String,
      default: "",
    },

    preferredLanguage: {
      type: String,
      default: "English (US)",
    },

    savedDestinations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);