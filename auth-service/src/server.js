require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userStore = require("./store/userStore");

const app = express();

app.use(cors());
app.use(express.json());

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
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required"
      });
    }

    if (userStore.findByEmail(email)) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userStore.addUser({
      id: crypto.randomUUID(),
      username: String(username).trim(),
      email: String(email).toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        username: user.username,
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

    const user = userStore.findByEmail(email);

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
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
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
  console.log(`Users stored in ${userStore.USERS_FILE}`);
});