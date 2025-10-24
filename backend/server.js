// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const next = require("next");
require("dotenv").config();

// Initialize app
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../frontend") });
const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
const authRoutes = require("./routes/authRoutes");
const locationsRoutes = require("./routes/locationsRoutes");
const userLocationRoutes = require("./routes/userLocationRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/user-locations", userLocationRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/profile", profileRoutes);

// WebSocket setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// MongoDB connection + Next.js integration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

nextApp.prepare().then(async () => {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connected");
    } else {
      console.warn("⚠ No MongoDB URI provided");
    }

    // Next.js page handler
    app.all("*", (req, res) => handle(req, res));

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  }
});
