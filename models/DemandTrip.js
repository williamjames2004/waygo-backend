const mongoose = require("mongoose");

const demandedTripSchema = new mongoose.Schema(
  {
    demandTripId: {
      type: String,
      unique: true,
      required: true
    },

    startingBusstandId: {
      type: String,
      required: true
    },

    endingBusstandId: {
      type: String,
      required: true
    },

    requestedDate: {
      type: Date,
      required: true
    },

    requestedDepartureTime: {
      type: String,
      required: true
    },

    totalDemand: {
      type: Number,
      default: 0
    },

    busCapacity: {
      type: Number,
      default: 0
    },

    requiredDemand: {
      type: Number,
      default: 0
    },

    criteria: {
      type: String,
      default: "60_PERCENT"
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "qualified",
        "bus_requested",
        "bus_assigned",
        "converted",
        "cancelled"
      ],
      default: "waiting"
    },

    busAssigned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "DemandedTrip",
  demandedTripSchema
);