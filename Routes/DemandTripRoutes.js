const express = require("express");
const router = express.Router();

const {
  getDemandedTrips,
  getDemandedTripById,
  checkDemandStatus,
  updateDemandStatus,
  assignBusToDemand
} = require("../controllers/demandedTripController");

router.get("/", getDemandedTrips);

router.get("/:demandTripId", getDemandedTripById);

router.get("/:demandTripId/status", checkDemandStatus);

router.put("/:demandTripId/status", updateDemandStatus);

router.put("/:demandTripId/assign-bus", assignBusToDemand);

module.exports = router;