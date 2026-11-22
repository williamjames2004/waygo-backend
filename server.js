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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>WayGO API Status</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #1e293b, #0f172a);
          color: #f8fafc;
        }
        .card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 4rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          max-width: 450px;
          width: 90%;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .dot {
          width: 10px;
          height: 10px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: pulse 2s infinite;
        }
        h1 {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .footer {
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.8rem;
          color: #64748b;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">
          <span class="dot"></span>
          ONLINE
        </div>
        <h1>Server is Running</h1>
        <p>WayGO API services are active and ready to accept requests.</p>
        <div class="footer">
          Timestamp: ${new Date().toUTCString()}
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`WayGO server running on port ${PORT}`);
});