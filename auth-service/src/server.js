require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

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
// REGISTER
// ==========================================

app.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const displayName = name || username;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: displayName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);

    res.status(500).json({
      message: "Unable to register user",
      error: error.message
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    res.status(500).json({
      message: "Unable to log in",
      error: error.message
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});