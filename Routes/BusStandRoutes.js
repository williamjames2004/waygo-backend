const express = require("express");
const router = express.Router();

const {
  createBusStand,
  getBusStands,
  getBusStandById,
  getBusStandByDistrictID,
  updateBusStand,
  deleteBusStand
} = require("../controllers/busStandController");

router.post("/", createBusStand);
router.get("/", getBusStands);
router.get("/:busstandId", getBusStandById);
router.get("/district/:districtId", getBusStandByDistrictID);
router.put("/:busstandId", updateBusStand);
router.delete("/:busstandId", deleteBusStand);

module.exports = router;