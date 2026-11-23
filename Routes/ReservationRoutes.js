const express = require("express");
const router = express.Router();

const {
  createReservation,
  getReservations,
  getReservationById,
  getPassengerReservations,
  getReservationsByBusId,
  cancelReservation
} = require("../controllers/reservationController");

router.post("/", createReservation);

router.get("/", getReservations);

router.get("/passenger/:passengerId", getPassengerReservations);
router.get("/bus/:busId", getReservationsByBusId);

router.get("/:reservationId", getReservationById);

router.put("/:reservationId/cancel", cancelReservation);

module.exports = router;