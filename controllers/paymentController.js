const Payment = require("../models/Payment");
const Reservation = require("../models/Reservation");
const generateId = require("../utils/generateID");

const createPayment = async (req, res) => {
  try {
    const {
      passengerId,
      reservationId,
      busId,
      routeId,
      amount,
      transactionId
    } = req.body;

    if (
      !passengerId ||
      !reservationId ||
      !busId ||
      !routeId ||
      amount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required"
      });
    }

    const reservation = await Reservation.findOne({
      reservationId
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    if (
      reservation.passengerId !== passengerId
    ) {
      return res.status(400).json({
        success: false,
        message: "Passenger does not match reservation"
      });
    }

    if (reservation.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Reservation is cancelled"
      });
    }

    const paymentId = await generateId(
      "payment",
      "PAY",
      8
    );

    const payment = await Payment.create({
      paymentId,
      passengerId,
      reservationId,
      busId,
      routeId,
      amount,
      transactionId:
        transactionId || null,
      paymentStatus: transactionId
        ? "paid"
        : "pending",
      paymentAt: transactionId
        ? new Date()
        : null
    });

    if (transactionId) {
      reservation.paymentStatus = "paid";
      reservation.bookingStatus = "confirmed";

      await reservation.save();
    }

    res.status(201).json({
      success: true,
      message: transactionId
        ? "Payment completed and reservation confirmed"
        : "Payment created",
      payment,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.paymentStatus) {
      filter.paymentStatus =
        req.query.paymentStatus;
    }

    if (req.query.passengerId) {
      filter.passengerId =
        req.query.passengerId;
    }

    const payments = await Payment.find(filter).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      paymentId: req.params.paymentId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPaymentByReservation = async (
  req,
  res
) => {
  try {
    const payments = await Payment.find({
      reservationId:
        req.params.reservationId
    }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const { paymentStatus, transactionId } =
      req.body;

    const validStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded"
    ];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
      });
    }

    const payment = await Payment.findOne({
      paymentId: req.params.paymentId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.paymentStatus = paymentStatus;

    if (transactionId) {
      payment.transactionId = transactionId;
    }

    if (paymentStatus === "paid") {
      payment.paymentAt = new Date();
    }

    await payment.save();

    const reservation = await Reservation.findOne({
      reservationId: payment.reservationId
    });

    if (reservation) {
      if (paymentStatus === "paid") {
        reservation.paymentStatus = "paid";
        reservation.bookingStatus = "confirmed";
      }

      if (paymentStatus === "failed") {
        reservation.paymentStatus = "failed";
      }

      if (paymentStatus === "refunded") {
        reservation.paymentStatus = "refunded";
        reservation.bookingStatus = "refunded";
      }

      await reservation.save();
    }

    res.json({
      success: true,
      message: "Payment status updated successfully",
      payment,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      paymentId: req.params.paymentId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    if (payment.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid payments can be refunded"
      });
    }

    payment.paymentStatus = "refunded";
    payment.refundStatus = "refunded";

    await payment.save();

    const reservation = await Reservation.findOne({
      reservationId: payment.reservationId
    });

    if (reservation) {
      reservation.paymentStatus = "refunded";
      reservation.bookingStatus = "refunded";

      await reservation.save();
    }

    res.json({
      success: true,
      message: "Payment refunded successfully",
      payment,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  getPaymentByReservation,
  updatePaymentStatus,
  refundPayment
};