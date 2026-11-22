const express = require("express");
const router = express.Router();

const {
  createDemandReservation,
  getDemandReservations,
  getDemandReservationById,
  getPassengerDemandReservations,
  cancelDemandReservation
} = require("../controllers/demandReservationController");

router.post("/", createDemandReservation);

router.get("/", getDemandReservations);

router.get(
  "/passenger/:passengerId",
  getPassengerDemandReservations
);

router.get("/:demandReservationId", getDemandReservationById);

router.put(
  "/:demandReservationId/cancel",
  cancelDemandReservation
);

module.exports = router;