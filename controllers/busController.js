const bcrypt = require("bcrypt");
const Bus = require("../models/Bus");
const generateId = require("../utils/generateId");

const createBus = async (req, res) => {
  try {
    const {
      busName,
      ownerName,
      phone,
      email,
      place,
      numberPlate,
      totalSeats,
      busType,
      category,
      password
    } = req.body;

    if (
      !busName ||
      !ownerName ||
      !phone ||
      !email ||
      !place ||
      !numberPlate ||
      !totalSeats ||
      !busType ||
      !category ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All bus details are required"
      });
    }

    const existingBus = await Bus.findOne({
      numberPlate: numberPlate.toUpperCase()
    });

    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: "Bus with this number plate already exists"
      });
    }

    const busId = await generateId(
      "bus",
      "BUS",
      3
    );

    const passwordHash = await bcrypt.hash(password, 10);

    const bus = await Bus.create({
      busId,
      busName,
      ownerName,
      phone,
      email,
      place,
      numberPlate: numberPlate.toUpperCase(),
      totalSeats,
      busType,
      category,
      passwordHash
    });

    const responseBus = bus.toObject();
    delete responseBus.passwordHash;

    res.status(201).json({
      success: true,
      message: "Bus created successfully",
      bus: responseBus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBuses = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.busType) {
      filter.busType = req.query.busType;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const buses = await Bus.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: buses.length,
      buses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      busId: req.params.busId
    }).select("-passwordHash");

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    res.json({
      success: true,
      bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateBus = async (req, res) => {
  try {
    const updateData = { ...req.body };

    delete updateData.password;
    delete updateData.passwordHash;
    delete updateData.busId;

    if (req.body.password) {
      updateData.passwordHash = await bcrypt.hash(
        req.body.password,
        10
      );
    }

    if (updateData.numberPlate) {
      updateData.numberPlate =
        updateData.numberPlate.toUpperCase();
    }

    const bus = await Bus.findOneAndUpdate(
      { busId: req.params.busId },
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-passwordHash");

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    res.json({
      success: true,
      message: "Bus updated successfully",
      bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findOneAndDelete({
      busId: req.params.busId
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    res.json({
      success: true,
      message: "Bus deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus
};