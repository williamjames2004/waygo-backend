const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
  {
    passengerId: {
      type: String,
      unique: true,
      required: true
    },

    aadhar: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    email: {
      type: String,
      default: null
    },

    passwordHash: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Passenger", passengerSchema);