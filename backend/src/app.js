const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const stackRoutes = require("./routes/stack.routes");

const app = express();

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
// Build allowed origins from environment
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:7173",
  "https://timely-jet.vercel.app",
];

// Add production frontend URL if configured
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use("/api/auth", limiter, authRoutes);
app.use("/api/user", limiter, userRoutes);
app.use("/api/stacks", limiter, stackRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Interval Timer API",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
