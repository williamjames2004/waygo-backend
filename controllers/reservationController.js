const Reservation = require("../models/Reservation");
const Passenger = require("../models/Passenger");
const Route = require("../models/Route");
const Bus = require("../models/Bus");
const generateId = require("../utils/generateID");

const createReservation = async (req, res) => {
  try {
    const {
      passengerId,
      busId,
      routeId,
      startingBusstandId,
      endingBusstandId,
      startingBusstopId,
      endingBusstopId,
      seatNumbers,
      amount
    } = req.body;

    if (
      !passengerId ||
      !busId ||
      !routeId ||
      !startingBusstandId ||
      !endingBusstandId ||
      !startingBusstopId ||
      !endingBusstopId ||
      !seatNumbers ||
      !Array.isArray(seatNumbers) ||
      seatNumbers.length === 0 ||
      amount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All reservation details are required"
      });
    }

    const passenger = await Passenger.findOne({
      passengerId
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found"
      });
    }

    const bus = await Bus.findOne({ busId });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    const route = await Route.findOne({
      routeId,
      busId
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found for this bus"
      });
    }

    const startStop = route.stops.find(
      stop => stop.busstopId === startingBusstopId
    );

    const endStop = route.stops.find(
      stop => stop.busstopId === endingBusstopId
    );

    if (!startStop || !endStop) {
      return res.status(400).json({
        success: false,
        message: "Selected bus stops are not part of this route"
      });
    }

    if (startStop.sequence >= endStop.sequence) {
      return res.status(400).json({
        success: false,
        message: "Starting stop must come before ending stop"
      });
    }

    const uniqueSeats = [...new Set(seatNumbers)];

    for (const seatNo of uniqueSeats) {
      if (
        !Number.isInteger(seatNo) ||
        seatNo < 1 ||
        seatNo > route.totalSeats
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid seat number: ${seatNo}`
        });
      }
    }

    const reservations = await Reservation.find({
      routeId,
      bookingStatus: {
        $in: ["pending_payment", "confirmed"]
      }
    });

    const unavailableSeats = [];

    for (const reservation of reservations) {
      for (const seat of reservation.seats) {
        if (!uniqueSeats.includes(seat.seatNo)) {
          continue;
        }

        const bookedStart = route.stops.find(
          stop => stop.busstopId === seat.startingBusstopId
        );

        const bookedEnd = route.stops.find(
          stop => stop.busstopId === seat.endingBusstopId
        );

        if (!bookedStart || !bookedEnd) {
          continue;
        }

        const overlap =
          startStop.sequence < bookedEnd.sequence &&
          endStop.sequence > bookedStart.sequence;

        if (overlap) {
          unavailableSeats.push(seat.seatNo);
        }
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Some selected seats are already booked",
        unavailableSeats: [
          ...new Set(unavailableSeats)
        ]
      });
    }

    const seats = uniqueSeats.map(seatNo => ({
      seatNo,
      passengerId,
      startingBusstopId,
      endingBusstopId
    }));

    const reservationId = await generateId(
      "reservation",
      "RES",
      8
    );

    const reservation = await Reservation.create({
      reservationId,
      passengerId,
      busId,
      routeId,
      startingBusstandId,
      endingBusstandId,
      startingBusstopId,
      endingBusstopId,
      seats,
      totalSeats: seats.length,
      amount,
      paymentStatus: "pending",
      bookingStatus: "pending_payment"
    });

    res.status(201).json({
      success: true,
      message: "Reservation created. Complete payment to confirm booking.",
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getReservations = async (req, res) => {
  try {
    const filter = {};

    if (req.query.routeId) {
      filter.routeId = req.query.routeId;
    }

    if (req.query.bookingStatus) {
      filter.bookingStatus = req.query.bookingStatus;
    }

    const reservations = await Reservation.find(filter).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      reservationId: req.params.reservationId
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPassengerReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      passengerId: req.params.passengerId
    }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      reservationId: req.params.reservationId
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    if (
      reservation.bookingStatus === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Reservation is already cancelled"
      });
    }

    reservation.bookingStatus = "cancelled";

    if (reservation.paymentStatus === "paid") {
      reservation.paymentStatus = "refunded";
    }

    await reservation.save();

    res.json({
      success: true,
      message: "Reservation cancelled successfully",
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
  createReservation,
  getReservations,
  getReservationById,
  getPassengerReservations,
  cancelReservation
};