const BusStop = require("../models/BusStop");
const BusStand = require("../models/BusStand");
const District = require("../models/District");
const generateId = require("../utils/generateId");

const createBusStop = async (req, res) => {
  try {
    const {
      busstopName,
      busstandId,
      districtId
    } = req.body;

    if (!busstopName || !busstandId || !districtId) {
      return res.status(400).json({
        success: false,
        message: "Bus stop name, bus stand ID and district ID are required"
      });
    }

    const busStand = await BusStand.findOne({ busstandId });

    if (!busStand) {
      return res.status(404).json({
        success: false,
        message: "Bus stand not found"
      });
    }

    const district = await District.findOne({ districtId });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found"
      });
    }

    const existingBusStop = await BusStop.findOne({
      busstopName: busstopName.trim(),
      busstandId
    });

    if (existingBusStop) {
      return res.status(400).json({
        success: false,
        message: "Bus stop already exists"
      });
    }

    const busstopId = await generateId(
      "busstop",
      "STOP",
      4
    );

    const busStop = await BusStop.create({
      busstopId,
      busstopName: busstopName.trim(),
      busstandId,
      districtId
    });

    res.status(201).json({
      success: true,
      message: "Bus stop created successfully",
      busStop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBusStops = async (req, res) => {
  try {
    const filter = {};

    if (req.query.busstandId) {
      filter.busstandId = req.query.busstandId;
    }

    if (req.query.districtId) {
      filter.districtId = req.query.districtId;
    }

    const busStops = await BusStop.find(filter).sort({
      busstopName: 1
    });

    res.json({
      success: true,
      count: busStops.length,
      busStops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBusStopById = async (req, res) => {
  try {
    const busStop = await BusStop.findOne({
      busstopId: req.params.busstopId
    });

    if (!busStop) {
      return res.status(404).json({
        success: false,
        message: "Bus stop not found"
      });
    }

    res.json({
      success: true,
      busStop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateBusStop = async (req, res) => {
  try {
    const busStop = await BusStop.findOneAndUpdate(
      { busstopId: req.params.busstopId },
      {
        busstopName: req.body.busstopName,
        busstandId: req.body.busstandId,
        districtId: req.body.districtId,
        status: req.body.status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!busStop) {
      return res.status(404).json({
        success: false,
        message: "Bus stop not found"
      });
    }

    res.json({
      success: true,
      message: "Bus stop updated successfully",
      busStop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteBusStop = async (req, res) => {
  try {
    const busStop = await BusStop.findOneAndDelete({
      busstopId: req.params.busstopId
    });

    if (!busStop) {
      return res.status(404).json({
        success: false,
        message: "Bus stop not found"
      });
    }

    res.json({
      success: true,
      message: "Bus stop deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBusStop,
  getBusStops,
  getBusStopById,
  updateBusStop,
  deleteBusStop
};