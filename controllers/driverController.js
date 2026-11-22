const bcrypt = require("bcrypt");
const Driver = require("../models/Driver");
const Bus = require("../models/Bus");
const generateId = require("../utils/generateId");

const createDriver = async (req, res) => {
  try {
    const {
      busId,
      name,
      phone,
      email,
      password,
      licenceNo
    } = req.body;

    if (
      !busId ||
      !name ||
      !phone ||
      !email ||
      !password ||
      !licenceNo
    ) {
      return res.status(400).json({
        success: false,
        message: "All driver details are required"
      });
    }

    const bus = await Bus.findOne({ busId });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    const existingDriver = await Driver.findOne({
      licenceNo
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver with this licence number already exists"
      });
    }

    const driverId = await generateId(
      "driver",
      "DR",
      4
    );

    const passwordHash = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      driverId,
      busId,
      name,
      phone,
      email,
      passwordHash,
      licenceNo
    });

    const responseDriver = driver.toObject();
    delete responseDriver.passwordHash;

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      driver: responseDriver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDrivers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.busId) {
      filter.busId = req.query.busId;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const drivers = await Driver.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findOne({
      driverId: req.params.driverId
    }).select("-passwordHash");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    res.json({
      success: true,
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const updateData = { ...req.body };

    delete updateData.driverId;
    delete updateData.passwordHash;

    if (req.body.password) {
      updateData.passwordHash = await bcrypt.hash(
        req.body.password,
        10
      );
    }

    delete updateData.password;

    const driver = await Driver.findOneAndUpdate(
      { driverId: req.params.driverId },
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-passwordHash");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    res.json({
      success: true,
      message: "Driver updated successfully",
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({
      driverId: req.params.driverId
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    res.json({
      success: true,
      message: "Driver deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
};