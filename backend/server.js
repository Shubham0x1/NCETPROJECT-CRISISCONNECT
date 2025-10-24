// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const next = require("next");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const locationsRoutes = require("./routes/locationsRoutes");
const userLocationRoutes = require("./routes/userLocationRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const profileRoutes = require("./routes/profileRoutes");
// const translateRoutes = require('./routes/translateRoutes'); // <-- REMOVED

const app = express();
const server = http.createServer(app);

// Setup WebSocket server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Make io accessible in routes
app.set("io", io);

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/user-locations", userLocationRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/profile", profileRoutes);
// app.use('/api/translate', translateRoutes); // <-- REMOVED

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Setup Next.js
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../frontend") });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  // Let Next.js handle all remaining routes
  app.all("*", (req, res) => handle(req, res));
});

// MongoDB Connection + Server Start
async function startServer() {
  try {
    if (!MONGO_URI) {
      console.warn("No MongoDB URI provided. Server will run without DB features.");
    } else {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully");
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server ready`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.warn("Starting server without DB connection (DB-dependent features won't work).");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server ready`);
    });
  }
}

startServer();
