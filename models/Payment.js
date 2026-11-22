const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
      required: true
    },

    passengerId: {
      type: String,
      required: true
    },

    reservationId: {
      type: String,
      required: true
    },

    busId: {
      type: String,
      required: true
    },

    routeId: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    transactionId: {
      type: String,
      default: null
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded"
      ],
      default: "pending"
    },

    paymentAt: {
      type: Date,
      default: null
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

    remarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);