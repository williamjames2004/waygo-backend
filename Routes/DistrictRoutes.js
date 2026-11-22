const express = require("express");
const router = express.Router();

const {
  createDistrict,
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict
} = require("../controllers/districtController");

router.post("/", createDistrict);
router.get("/", getDistricts);
router.get("/:districtId", getDistrictById);
router.put("/:districtId", updateDistrict);
router.delete("/:districtId", deleteDistrict);

module.exports = router;