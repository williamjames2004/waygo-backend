const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    districtId: {
      type: String,
      unique: true,
      required: true
    },
    districtName: {
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

module.exports = mongoose.model("District", districtSchema);