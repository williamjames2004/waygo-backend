const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      unique: true,
      required: true
    },
    busId: {
      type: String,
      required: true
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
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    licenceNo: {
      type: String,
      required: true,
      unique: true
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

module.exports = mongoose.model("Driver", driverSchema);