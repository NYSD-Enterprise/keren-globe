const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Auth Service is running",
    service: "auth-service",
    port: process.env.PORT || 5005
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "auth-service"
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});