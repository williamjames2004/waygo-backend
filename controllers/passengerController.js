const bcrypt = require("bcrypt");
const Passenger = require("../models/Passenger");
const generateId = require("../utils/generateID");

// Register Passenger
const registerPassenger = async (req, res) => {
  try {
    const {
      aadhar,
      name,
      phone,
      email,
      password
    } = req.body;

    if (!aadhar || !name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Aadhar, name, phone and password are required"
      });
    }

    const existingPassenger = await Passenger.findOne({
      aadhar
    });

    if (existingPassenger) {
      return res.status(400).json({
        success: false,
        message: "Passenger with this Aadhar already exists"
      });
    }

    const passengerId = await generateId(
      "passenger",
      "P",
      7
    );

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const passenger = await Passenger.create({
      passengerId,
      aadhar,
      name,
      phone,
      email: email || null,
      passwordHash
    });

    const responsePassenger = passenger.toObject();

    delete responsePassenger.passwordHash;

    res.status(201).json({
      success: true,
      message: "Passenger registered successfully",
      passenger: responsePassenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Passengers
const getPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: passengers.length,
      passengers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get Passenger By Aadhar
const getPassengerByAadhar = async (req, res) => {
  try {
    const passenger = await Passenger.findOne({
      aadhar: req.params.aadhar
    }).select("-passwordHash");

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found"
      });
    }

    res.json({
      success: true,
      passenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Login Passenger
const loginPassenger = async (req, res) => {
  try {
    const {
      aadhar,
      password
    } = req.body;

    if (!aadhar || !password) {
      return res.status(400).json({
        success: false,
        message: "Aadhar and password are required"
      });
    }

    const passenger = await Passenger.findOne({
      aadhar
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      passenger.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const responsePassenger = passenger.toObject();

    delete responsePassenger.passwordHash;

    res.json({
      success: true,
      message: "Login successful",
      passenger: responsePassenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Update Passenger By Aadhar
const updatePassenger = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (password !== undefined) {
      updateData.passwordHash = await bcrypt.hash(
        password,
        10
      );
    }

    const passenger = await Passenger.findOneAndUpdate(
      {
        aadhar: req.params.aadhar
      },
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-passwordHash");

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found"
      });
    }

    res.json({
      success: true,
      message: "Passenger updated successfully",
      passenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Delete Passenger By Aadhar
const deletePassenger = async (req, res) => {
  try {
    const passenger = await Passenger.findOneAndDelete({
      aadhar: req.params.aadhar
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found"
      });
    }

    res.json({
      success: true,
      message: "Passenger deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  registerPassenger,
  getPassengers,
  getPassengerByAadhar,
  loginPassenger,
  updatePassenger,
  deletePassenger
};