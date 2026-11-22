const express = require("express");
const router = express.Router();

const {
  createBusStop,
  getBusStops,
  getBusStopById,
  updateBusStop,
  deleteBusStop
} = require("../controllers/busStopController");

router.post("/", createBusStop);
router.get("/", getBusStops);
router.get("/:busstopId", getBusStopById);
router.put("/:busstopId", updateBusStop);
router.delete("/:busstopId", deleteBusStop);

module.exports = router;