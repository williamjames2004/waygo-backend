const DemandReservation = require("../models/DemandReservation");
const Passenger = require("../models/Passenger");
const DemandedTrip = require("../models/DemandTrip");
const generateId = require("../utils/generateId");

const createDemandReservation = async (req, res) => {
  try {
    const {
      passengerId,
      startingBusstandId,
      endingBusstandId,
      startingBusstopId,
      endingBusstopId,
      requestedDate,
      requestedDepartureTime,
      passengerCount
    } = req.body;

    if (
      !passengerId ||
      !startingBusstandId ||
      !endingBusstandId ||
      !requestedDate ||
      !requestedDepartureTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Required demand details are missing"
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

    const count = passengerCount || 1;

    const demandReservationId = await generateId(
      "demandReservation",
      "DMD",
      8
    );

    const demandReservation =
      await DemandReservation.create({
        demandReservationId,
        passengerId,
        startingBusstandId,
        endingBusstandId,
        startingBusstopId:
          startingBusstopId || null,
        endingBusstopId:
          endingBusstopId || null,
        requestedDate,
        requestedDepartureTime,
        passengerCount: count
      });

    let demandedTrip = await DemandedTrip.findOne({
      startingBusstandId,
      endingBusstandId,
      requestedDate: {
        $gte: new Date(requestedDate),
        $lt: new Date(
          new Date(requestedDate).getTime() +
            24 * 60 * 60 * 1000
        )
      },
      requestedDepartureTime
    });

    if (!demandedTrip) {
      const demandTripId = await generateId(
        "demandTrip",
        "DMDTRIP",
        6
      );

      demandedTrip = await DemandedTrip.create({
        demandTripId,
        startingBusstandId,
        endingBusstandId,
        requestedDate,
        requestedDepartureTime,
        totalDemand: count,
        status: "waiting"
      });
    } else {
      demandedTrip.totalDemand += count;
      await demandedTrip.save();
    }

    res.status(201).json({
      success: true,
      message: "Demand reservation created successfully",
      demandReservation,
      demandedTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDemandReservations = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.requestedDate) {
      const startDate = new Date(req.query.requestedDate);
      const endDate = new Date(req.query.requestedDate);

      endDate.setDate(endDate.getDate() + 1);

      filter.requestedDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const demandReservations =
      await DemandReservation.find(filter).sort({
        createdAt: -1
      });

    res.json({
      success: true,
      count: demandReservations.length,
      demandReservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDemandReservationById = async (req, res) => {
  try {
    const demandReservation =
      await DemandReservation.findOne({
        demandReservationId:
          req.params.demandReservationId
      });

    if (!demandReservation) {
      return res.status(404).json({
        success: false,
        message: "Demand reservation not found"
      });
    }

    res.json({
      success: true,
      demandReservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPassengerDemandReservations = async (
  req,
  res
) => {
  try {
    const demandReservations =
      await DemandReservation.find({
        passengerId: req.params.passengerId
      }).sort({
        createdAt: -1
      });

    res.json({
      success: true,
      count: demandReservations.length,
      demandReservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const cancelDemandReservation = async (req, res) => {
  try {
    const demandReservation =
      await DemandReservation.findOne({
        demandReservationId:
          req.params.demandReservationId
      });

    if (!demandReservation) {
      return res.status(404).json({
        success: false,
        message: "Demand reservation not found"
      });
    }

    demandReservation.status = "cancelled";

    await demandReservation.save();

    res.json({
      success: true,
      message: "Demand reservation cancelled successfully",
      demandReservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createDemandReservation,
  getDemandReservations,
  getDemandReservationById,
  getPassengerDemandReservations,
  cancelDemandReservation
};