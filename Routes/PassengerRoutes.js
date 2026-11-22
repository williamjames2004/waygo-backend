const express = require("express");
const router = express.Router();

const {
  registerPassenger,
  getPassengers,
  getPassengerByAadhar,
  loginPassenger,
  updatePassenger,
  deletePassenger
} = require("../controllers/passengerController");

router.post("/register", registerPassenger);
router.get("/", getPassengers);
router.get("/:aadhar", getPassengerByAadhar);
router.post("/login", loginPassenger);
router.put("/:aadhar", updatePassenger);
router.delete("/:aadhar", deletePassenger);

module.exports = router;