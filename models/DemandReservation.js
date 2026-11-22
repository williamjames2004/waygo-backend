const mongoose = require("mongoose");

const demandReservationSchema = new mongoose.Schema(
  {
    demandReservationId: {
      type: String,
      unique: true,
      required: true
    },

    passengerId: {
      type: String,
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

    startingBusstopId: {
      type: String,
      default: null
    },

    endingBusstopId: {
      type: String,
      default: null
    },

    requestedDate: {
      type: Date,
      required: true
    },

    requestedDepartureTime: {
      type: String,
      required: true
    },

    passengerCount: {
      type: Number,
      default: 1
    },

    amount: {
      type: Number,
      default: 0
    },

    paymentStatus: {
      type: String,
      enum: [
        "not_required",
        "pending",
        "paid",
        "failed"
      ],
      default: "not_required"
    },

    refundStatus: {
      type: String,
      enum: [
        "not_required",
        "pending",
        "refunded"
      ],
      default: "not_required"
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "qualified",
        "bus_assigned",
        "converted",
        "cancelled"
      ],
      default: "waiting"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "DemandReservation",
  demandReservationSchema
);