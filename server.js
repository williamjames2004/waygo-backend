require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const passengerRoutes = require("./Routes/PassengerRoutes");
const busRoutes = require("./Routes/BusRoutes");
const driverRoutes = require("./Routes/DriverRoutes");
const districtRoutes = require("./Routes/DistrictRoutes");
const busStandRoutes = require("./Routes/BusStandRoutes");
const busStopRoutes = require("./Routes/BusStopRoutes");
const routeRoutes = require("./Routes/routeRoutes");
const reservationRoutes = require("./Routes/ReservationRoutes");
const demandReservationRoutes = require("./Routes/DemandReservationRoutes");
const demandedTripRoutes = require("./Routes/DemandTripRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");

app.use("/api/passengers", passengerRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/busstands", busStandRoutes);
app.use("/api/busstops", busStopRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/demand-reservations", demandReservationRoutes);
app.use("/api/demanded-trips", demandedTripRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WayGO API is running"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`WayGO server running on port ${PORT}`);
});