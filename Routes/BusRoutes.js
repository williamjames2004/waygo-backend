const express = require("express");
const router = express.Router();

const {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus
} = require("../controllers/busController");

router.post("/", createBus);
router.get("/", getBuses);
router.get("/:busId", getBusById);
router.put("/:busId", updateBus);
router.delete("/:busId", deleteBus);

module.exports = router;