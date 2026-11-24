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
router.get("/:aadhar", getPassengerByAadhar);
router.get("/:id", getPassengerById);
router.post("/login", loginPassenger);
router.put("/:aadhar", updatePassenger);
router.delete("/:aadhar", deletePassenger);

module.exports = router;