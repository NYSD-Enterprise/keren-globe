  require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// MICROSERVICE URLS
// ===============================
// Docker Compose will provide these
// service names through environment variables.
// The localhost fallbacks allow normal
// local development with npm run dev.

const DESTINATION_SERVICE =
  process.env.DESTINATION_SERVICE || "http://127.0.0.1:5002";

const RECOMMENDATION_SERVICE =
  process.env.RECOMMENDATION_SERVICE || "http://127.0.0.1:5004";

const ITINERARY_SERVICE =
  process.env.ITINERARY_SERVICE || "http://127.0.0.1:5003";

const AUTH_SERVICE =
  process.env.AUTH_SERVICE || "http://127.0.0.1:5005";

const PORT = process.env.PORT || 5001;

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "GlobeTrotter API Gateway is running",
    service: "api-gateway",
    port: PORT
  });
});

// ===============================
// DESTINATIONS
// ===============================

app.get("/destinations", async (req, res) => {
  try {
    const response = await fetch(
      DESTINATION_SERVICE + "/destinations"
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("DESTINATION ERROR:", error.message);

    res.status(503).json({
      message: "Destination Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// SINGLE DESTINATION
// ===============================

app.get("/destinations/:id", async (req, res) => {
  try {
    const response = await fetch(
      DESTINATION_SERVICE +
        "/destinations/" +
        req.params.id
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("DESTINATION ERROR:", error.message);

    res.status(503).json({
      message: "Destination Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// RECOMMENDATIONS
// ===============================

app.get("/recommendations", async (req, res) => {
  try {
    let url =
      RECOMMENDATION_SERVICE + "/recommendations";

    if (req.query.category) {
      url =
        url +
        "?category=" +
        encodeURIComponent(req.query.category);
    }

    console.log("Recommendation request:", url);

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error(
      "RECOMMENDATION ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Recommendation Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// GET ITINERARIES
// ===============================

app.get("/itineraries", async (req, res) => {
  try {
    const response = await fetch(
      ITINERARY_SERVICE + "/itineraries"
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error(
      "ITINERARY GET ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Itinerary Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// GET USER ITINERARIES
// ===============================

app.get(
  "/itineraries/user/:userId",
  async (req, res) => {
    try {
      const response = await fetch(
        ITINERARY_SERVICE +
          "/itineraries/user/" +
          req.params.userId
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error(
        "USER ITINERARY ERROR:",
        error.message
      );

      res.status(503).json({
        message: "Itinerary Service unavailable",
        error: error.message
      });
    }
  }
);

// ===============================
// CREATE ITINERARY
// ===============================

app.post("/itineraries", async (req, res) => {
  try {
    console.log(
      "Creating itinerary:",
      req.body
    );

    const response = await fetch(
      ITINERARY_SERVICE + "/itineraries",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(201).json(data);
  } catch (error) {
    console.error(
      "ITINERARY CREATE ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Itinerary Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// AUTH SERVICE
// ===============================
// These routes are ready for the
// authentication microservice.

app.post("/register", async (req, res) => {
  try {
    const response = await fetch(
      AUTH_SERVICE + "/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error(
      "AUTH REGISTER ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Auth Service unavailable",
      error: error.message
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const response = await fetch(
      AUTH_SERVICE + "/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error(
      "AUTH LOGIN ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Auth Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    route: req.originalUrl
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(
    "GlobeTrotter API Gateway is running on http://localhost:" +
      PORT
  );

  console.log(
    "Destination Service: " +
      DESTINATION_SERVICE
  );

  console.log(
    "Recommendation Service: " +
      RECOMMENDATION_SERVICE
  );

  console.log(
    "Itinerary Service: " +
      ITINERARY_SERVICE
  );

  console.log(
    "Auth Service: " +
      AUTH_SERVICE
  );
});