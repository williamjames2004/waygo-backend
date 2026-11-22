const express = require("express");
const router = express.Router();

const {
  createBusStand,
  getBusStands,
  getBusStandById,
  updateBusStand,
  deleteBusStand
} = require("../controllers/busStandController");

router.post("/", createBusStand);
router.get("/", getBusStands);
router.get("/:busstandId", getBusStandById);
router.put("/:busstandId", updateBusStand);
router.delete("/:busstandId", deleteBusStand);

module.exports = router;