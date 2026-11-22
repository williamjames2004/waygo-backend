const mongoose = require("mongoose");

const busStandSchema = new mongoose.Schema(
  {
    busstandId: {
      type: String,
      unique: true,
      required: true
    },
    busstandName: {
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

module.exports = mongoose.model("BusStand", busStandSchema);