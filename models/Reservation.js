const mongoose = require("mongoose");

const bookedSeatSchema = new mongoose.Schema(
  {
    seatNo: {
      type: Number,
      required: true
    },

    passengerId: {
      type: String,
      required: true
    },

    startingBusstopId: {
      type: String,
      required: true
    },

    endingBusstopId: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

const reservationSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      unique: true,
      required: true
    },

    passengerId: {
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
      required: true
    },

    endingBusstopId: {
      type: String,
      required: true
    },

    seats: {
      type: [bookedSeatSchema],
      required: true
    },

    totalSeats: {
      type: Number,
      required: true
    },

    amount: {
      type: Number,
      required: true
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

    bookingStatus: {
      type: String,
      enum: [
        "pending_payment",
        "confirmed",
        "cancelled",
        "completed",
        "refunded"
      ],
      default: "pending_payment"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);