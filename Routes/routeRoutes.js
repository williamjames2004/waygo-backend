const express = require("express");
const router = express.Router();

const {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  searchRoutes,
  getRouteStops,
  getAvailableSeats
} = require("../controllers/routeController");

router.post("/", createRoute);
router.get("/", getRoutes);

router.get("/search", searchRoutes);

router.get("/:routeId", getRouteById);
router.get("/:routeId/stops", getRouteStops);
router.get("/:routeId/seats", getAvailableSeats);

router.put("/:routeId", updateRoute);
router.delete("/:routeId", deleteRoute);

module.exports = router;