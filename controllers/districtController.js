const District = require("../models/District");
const generateId = require("../utils/generateId");

const createDistrict = async (req, res) => {
  try {
    const { districtName } = req.body;

    if (!districtName) {
      return res.status(400).json({
        success: false,
        message: "District name is required"
      });
    }

    const existingDistrict = await District.findOne({
      districtName: districtName.trim()
    });

    if (existingDistrict) {
      return res.status(400).json({
        success: false,
        message: "District already exists"
      });
    }

    const districtId = await generateId(
      "district",
      "DIST",
      4
    );

    const district = await District.create({
      districtId,
      districtName: districtName.trim()
    });

    res.status(201).json({
      success: true,
      message: "District created successfully",
      district
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDistricts = async (req, res) => {
  try {
    const districts = await District.find().sort({
      districtName: 1
    });

    res.json({
      success: true,
      count: districts.length,
      districts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDistrictById = async (req, res) => {
  try {
    const district = await District.findOne({
      districtId: req.params.districtId
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found"
      });
    }

    res.json({
      success: true,
      district
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateDistrict = async (req, res) => {
  try {
    const district = await District.findOneAndUpdate(
      { districtId: req.params.districtId },
      {
        districtName: req.body.districtName,
        status: req.body.status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found"
      });
    }

    res.json({
      success: true,
      message: "District updated successfully",
      district
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findOneAndDelete({
      districtId: req.params.districtId
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found"
      });
    }

    res.json({
      success: true,
      message: "District deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createDistrict,
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict
};