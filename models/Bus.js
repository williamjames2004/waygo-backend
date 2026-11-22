const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      unique: true,
      required: true
    },
    busName: {
      type: String,
      required: true
    },
    ownerName: {
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
    registeredDate: {
      type: Date,
      default: Date.now
    },
    place: {
      type: String,
      required: true
    },
    numberPlate: {
      type: String,
      required: true,
      unique: true
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },
    busType: {
      type: String,
      enum: ["AC", "NON_AC"],
      required: true
    },
    category: {
      type: String,
      enum: ["GOVERNMENT", "PRIVATE"],
      required: true
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

module.exports = mongoose.model("Bus", busSchema);