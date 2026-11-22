const mongoose = require("mongoose");

const busStopSchema = new mongoose.Schema(
  {
    busstopId: {
      type: String,
      unique: true,
      required: true
    },
    busstopName: {
      type: String,
      required: true
    },
    busstandId: {
      type: String,
      required: true
    },
    districtId: {
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

module.exports = mongoose.model("BusStop", busStopSchema);