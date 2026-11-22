const BusStand = require("../models/BusStand");
const District = require("../models/District");
const generateId = require("../utils/generateId");

const createBusStand = async (req, res) => {
  try {
    const { busstandName, districtId } = req.body;

    if (!busstandName || !districtId) {
      return res.status(400).json({
        success: false,
        message: "Bus stand name and district ID are required"
      });
    }

    const district = await District.findOne({ districtId });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found"
      });
    }

    const existingBusStand = await BusStand.findOne({
      busstandName: busstandName.trim(),
      districtId
    });

    if (existingBusStand) {
      return res.status(400).json({
        success: false,
        message: "Bus stand already exists in this district"
      });
    }

    const busstandId = await generateId(
      "busstand",
      "STAND",
      4
    );

    const busStand = await BusStand.create({
      busstandId,
      busstandName: busstandName.trim(),
      districtId
    });

    res.status(201).json({
      success: true,
      message: "Bus stand created successfully",
      busStand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBusStands = async (req, res) => {
  try {
    const filter = {};

    if (req.query.districtId) {
      filter.districtId = req.query.districtId;
    }

    const busStands = await BusStand.find(filter).sort({
      busstandName: 1
    });

    res.json({
      success: true,
      count: busStands.length,
      busStands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBusStandById = async (req, res) => {
  try {
    const busStand = await BusStand.findOne({
      busstandId: req.params.busstandId
    });

    if (!busStand) {
      return res.status(404).json({
        success: false,
        message: "Bus stand not found"
      });
    }

    res.json({
      success: true,
      busStand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateBusStand = async (req, res) => {
  try {
    const busStand = await BusStand.findOneAndUpdate(
      { busstandId: req.params.busstandId },
      {
        busstandName: req.body.busstandName,
        districtId: req.body.districtId,
        status: req.body.status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!busStand) {
      return res.status(404).json({
        success: false,
        message: "Bus stand not found"
      });
    }

    res.json({
      success: true,
      message: "Bus stand updated successfully",
      busStand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteBusStand = async (req, res) => {
  try {
    const busStand = await BusStand.findOneAndDelete({
      busstandId: req.params.busstandId
    });

    if (!busStand) {
      return res.status(404).json({
        success: false,
        message: "Bus stand not found"
      });
    }

    res.json({
      success: true,
      message: "Bus stand deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBusStand,
  getBusStands,
  getBusStandById,
  updateBusStand,
  deleteBusStand
};