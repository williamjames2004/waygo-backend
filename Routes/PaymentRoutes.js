const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPaymentById,
  getPaymentByReservation,
  updatePaymentStatus,
  refundPayment
} = require("../controllers/paymentController");

router.post("/", createPayment);

router.get("/", getPayments);

router.get("/reservation/:reservationId", getPaymentByReservation);

router.get("/:paymentId", getPaymentById);

router.put("/:paymentId/status", updatePaymentStatus);

router.put("/:paymentId/refund", refundPayment);

module.exports = router;