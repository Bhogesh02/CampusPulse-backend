const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const mealRoutes = require("./routes/mealRoutes");
require("dotenv").config();

const app = express();

// Connect to Database
connectDB();
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/meals", mealRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Hostel Management API is running...");
});

module.exports = app;
