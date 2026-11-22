const express = require("express");
const router = express.Router();

const {
  createBusStop,
  getBusStops,
  getBusStopById,
  getBusStopByBusStandId,
  updateBusStop,
  deleteBusStop
} = require("../controllers/busStopController");

router.post("/", createBusStop);
router.get("/", getBusStops);
router.get("/:busstopId", getBusStopById);
router.get("/busstand/:busstandId", getBusStopByBusStandId);
router.put("/:busstopId", updateBusStop);
router.delete("/:busstopId", deleteBusStop);

module.exports = router;