const Route = require("../models/Route");
const Bus = require("../models/Bus");
const BusStand = require("../models/BusStand");
const BusStop = require("../models/BusStop");
const Reservation = require("../models/Reservation");
const generateId = require("../utils/generateID");

const createRoute = async (req, res) => {
  try {
    const {
      startingBusstandId,
      endingBusstandId,
      startingDistrictId,
      endingDistrictId,
      busId,
      departureTime,
      reachingTime,
      travelDate,
      totalSeats,
      price,
      category,
      busType,
      stops
    } = req.body;

    if (
      !startingBusstandId ||
      !endingBusstandId ||
      !startingDistrictId ||
      !endingDistrictId ||
      !busId ||
      !departureTime ||
      !reachingTime ||
      !travelDate ||
      !totalSeats ||
      price === undefined ||
      !category ||
      !busType ||
      !stops ||
      stops.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "All route details are required"
      });
    }

    if (startingBusstandId === endingBusstandId) {
      return res.status(400).json({
        success: false,
        message: "Starting and ending bus stands cannot be same"
      });
    }

    const bus = await Bus.findOne({ busId });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    const startingBusStand = await BusStand.findOne({
      busstandId: startingBusstandId
    });

    const endingBusStand = await BusStand.findOne({
      busstandId: endingBusstandId
    });

    if (!startingBusStand || !endingBusStand) {
      return res.status(404).json({
        success: false,
        message: "Starting or ending bus stand not found"
      });
    }

    for (const stop of stops) {
      const busStop = await BusStop.findOne({
        busstopId: stop.busstopId
      });

      if (!busStop) {
        return res.status(404).json({
          success: false,
          message: `Bus stop ${stop.busstopId} not found`
        });
      }
    }

    const routeId = await generateId(
      "route",
      "RT",
      6
    );

    const route = await Route.create({
      routeId,
      startingBusstandId,
      endingBusstandId,
      startingDistrictId,
      endingDistrictId,
      busId,
      departureTime,
      reachingTime,
      travelDate,
      totalSeats,
      price,
      category,
      busType,
      stops
    });

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRoutes = async (req, res) => {
  try {
    const filter = {};

    if (req.query.busId) {
      filter.busId = req.query.busId;
    }

    if (req.query.travelDate) {
      const startDate = new Date(req.query.travelDate);
      const endDate = new Date(req.query.travelDate);

      endDate.setDate(endDate.getDate() + 1);

      filter.travelDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const routes = await Route.find(filter).sort({
      travelDate: 1,
      departureTime: 1
    });

    res.json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await Route.findOne({
      routeId: req.params.routeId
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found"
      });
    }

    res.json({
      success: true,
      route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const searchRoutes = async (req, res) => {
  try {
    const {
      startBusstandId,
      endBusstandId,
      travelDate
    } = req.query;

    if (
      !startBusstandId ||
      !endBusstandId ||
      !travelDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Starting bus stand, ending bus stand and travel date are required"
      });
    }

    const startDate = new Date(travelDate);
    const endDate = new Date(travelDate);

    endDate.setDate(endDate.getDate() + 1);

    const routes = await Route.find({
      startingBusstandId: startBusstandId,
      endingBusstandId: endBusstandId,
      travelDate: {
        $gte: startDate,
        $lt: endDate
      },
      status: {
        $ne: "cancelled"
      }
    }).sort({
      departureTime: 1
    });

    res.json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRouteStops = async (req, res) => {
  try {
    const route = await Route.findOne({
      routeId: req.params.routeId
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found"
      });
    }

    const stops = [...route.stops].sort(
      (a, b) => a.sequence - b.sequence
    );

    res.json({
      success: true,
      routeId: route.routeId,
      stops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAvailableSeats = async (req, res) => {
  try {
    const {
      startBusstopId,
      endBusstopId
    } = req.query;

    if (!startBusstopId || !endBusstopId) {
      return res.status(400).json({
        success: false,
        message: "Starting and ending bus stop IDs are required"
      });
    }

    const route = await Route.findOne({
      routeId: req.params.routeId
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found"
      });
    }

    const startStop = route.stops.find(
      stop => stop.busstopId === startBusstopId
    );

    const endStop = route.stops.find(
      stop => stop.busstopId === endBusstopId
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

    const reservations = await Reservation.find({
      routeId: route.routeId,
      bookingStatus: {
        $in: ["pending_payment", "confirmed"]
      }
    });

    const bookedSeats = new Set();

    for (const reservation of reservations) {
      for (const seat of reservation.seats) {
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
          bookedSeats.add(seat.seatNo);
        }
      }
    }

    const availableSeats = [];

    for (let seatNo = 1; seatNo <= route.totalSeats; seatNo++) {
      if (!bookedSeats.has(seatNo)) {
        availableSeats.push(seatNo);
      }
    }

    res.json({
      success: true,
      routeId: route.routeId,
      totalSeats: route.totalSeats,
      availableSeats,
      bookedSeats: Array.from(bookedSeats).sort(
        (a, b) => a - b
      )
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateRoute = async (req, res) => {
  try {
    const updateData = { ...req.body };

    delete updateData.routeId;

    const route = await Route.findOneAndUpdate(
      { routeId: req.params.routeId },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found"
      });
    }

    res.json({
      success: true,
      message: "Route updated successfully",
      route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findOneAndDelete({
      routeId: req.params.routeId
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found"
      });
    }

    res.json({
      success: true,
      message: "Route deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  searchRoutes,
  getRouteStops,
  getAvailableSeats
};