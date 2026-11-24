
const express = require("express");
const router = express.Router();

const {
    registerPassenger,
    getPassengers,
    getPassengerByAadhar,
    getPassengerById,
    loginPassenger,
    updatePassenger,
    deletePassenger
} = require("../controllers/passengerController");

router.post("/register", registerPassenger);
router.get("/", getPassengers);

// Get passenger using Aadhar
router.get("/aadhar/:aadhar", getPassengerByAadhar);

// Get passenger using Passenger ID
router.get("/id/:passengerId", getPassengerById);

router.post("/login", loginPassenger);
router.put("/:aadhar", updatePassenger);
router.delete("/:aadhar", deletePassenger);

module.exports = router;