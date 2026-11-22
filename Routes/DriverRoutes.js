const express = require("express");
const router = express.Router();

const {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
} = require("../controllers/driverController");

router.post("/", createDriver);
router.get("/", getDrivers);
router.get("/:driverId", getDriverById);
router.put("/:driverId", updateDriver);
router.delete("/:driverId", deleteDriver);

module.exports = router;