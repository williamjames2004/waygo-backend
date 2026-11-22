const DemandedTrip = require("../models/DemandTrip");
const Bus = require("../models/Bus");
const DemandReservation =
  require("../models/DemandReservation");

const getDemandedTrips = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const demandedTrips = await DemandedTrip.find(filter)
      .sort({
        requestedDate: 1,
        requestedDepartureTime: 1
      });

    res.json({
      success: true,
      count: demandedTrips.length,
      demandedTrips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDemandedTripById = async (req, res) => {
  try {
    const demandedTrip = await DemandedTrip.findOne({
      demandTripId: req.params.demandTripId
    });

    if (!demandedTrip) {
      return res.status(404).json({
        success: false,
        message: "Demanded trip not found"
      });
    }

    res.json({
      success: true,
      demandedTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const checkDemandStatus = async (req, res) => {
  try {
    const demandedTrip = await DemandedTrip.findOne({
      demandTripId: req.params.demandTripId
    });

    if (!demandedTrip) {
      return res.status(404).json({
        success: false,
        message: "Demanded trip not found"
      });
    }

    if (
      demandedTrip.busCapacity > 0 &&
      demandedTrip.totalDemand >=
        demandedTrip.requiredDemand
    ) {
      demandedTrip.status = "qualified";
      await demandedTrip.save();
    }

    const percentage =
      demandedTrip.busCapacity > 0
        ? (
            (demandedTrip.totalDemand /
              demandedTrip.busCapacity) *
            100
          ).toFixed(2)
        : 0;

    res.json({
      success: true,
      demandTripId: demandedTrip.demandTripId,
      totalDemand: demandedTrip.totalDemand,
      busCapacity: demandedTrip.busCapacity,
      requiredDemand: demandedTrip.requiredDemand,
      demandPercentage: Number(percentage),
      status: demandedTrip.status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateDemandStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "waiting",
      "qualified",
      "bus_requested",
      "bus_assigned",
      "converted",
      "cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid demand status"
      });
    }

    const demandedTrip = await DemandedTrip.findOneAndUpdate(
      { demandTripId: req.params.demandTripId },
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!demandedTrip) {
      return res.status(404).json({
        success: false,
        message: "Demanded trip not found"
      });
    }

    res.json({
      success: true,
      message: "Demand status updated successfully",
      demandedTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const assignBusToDemand = async (req, res) => {
  try {
    const { busId } = req.body;

    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "Bus ID is required"
      });
    }

    const bus = await Bus.findOne({ busId });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    const demandedTrip = await DemandedTrip.findOne({
      demandTripId: req.params.demandTripId
    });

    if (!demandedTrip) {
      return res.status(404).json({
        success: false,
        message: "Demanded trip not found"
      });
    }

    demandedTrip.busCapacity = bus.totalSeats;
    demandedTrip.requiredDemand = Math.ceil(
      bus.totalSeats * 0.60
    );
    demandedTrip.busAssigned = true;
    demandedTrip.status = "bus_assigned";

    await demandedTrip.save();

    await DemandReservation.updateMany(
      {
        startingBusstandId:
          demandedTrip.startingBusstandId,
        endingBusstandId:
          demandedTrip.endingBusstandId,
        requestedDate: {
          $gte: demandedTrip.requestedDate,
          $lt: new Date(
            demandedTrip.requestedDate.getTime() +
              24 * 60 * 60 * 1000
          )
        },
        requestedDepartureTime:
          demandedTrip.requestedDepartureTime,
        status: {
          $in: ["waiting", "qualified"]
        }
      },
      {
        status: "bus_assigned"
      }
    );

    res.json({
      success: true,
      message: "Bus assigned to demanded trip",
      demandedTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDemandedTrips,
  getDemandedTripById,
  checkDemandStatus,
  updateDemandStatus,
  assignBusToDemand
};