const mongoose = require("mongoose");

const routeStopSchema = new mongoose.Schema(
  {
    busstopId: {
      type: String,
      required: true
    },
    sequence: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);

const routeSchema = new mongoose.Schema(
  {
    routeId: {
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

    startingDistrictId: {
      type: String,
      required: true
    },

    endingDistrictId: {
      type: String,
      required: true
    },

    busId: {
      type: String,
      required: true
    },

    departureTime: {
      type: String,
      required: true
    },

    reachingTime: {
      type: String,
      required: true
    },

    travelDate: {
      type: Date,
      required: true
    },

    totalSeats: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      enum: ["GOVERNMENT", "PRIVATE"],
      required: true
    },

    busType: {
      type: String,
      enum: ["AC", "NON_AC"],
      required: true
    },

    stops: {
      type: [routeStopSchema],
      required: true
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "boarding",
        "running",
        "completed",
        "cancelled"
      ],
      default: "scheduled"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Route", routeSchema);