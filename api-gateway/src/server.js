require("dotenv").config();

const express = require("express");
const cors = require("cors");

const requireAuth = require("./middleware/requireAuth");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// MICROSERVICE URLS
// ===============================

const DESTINATION_SERVICE =
  process.env.DESTINATION_SERVICE || "http://127.0.0.1:5002";

const RECOMMENDATION_SERVICE =
  process.env.RECOMMENDATION_SERVICE || "http://127.0.0.1:5004";

const ITINERARY_SERVICE =
  process.env.ITINERARY_SERVICE || "http://127.0.0.1:5003";

const AUTH_SERVICE =
  process.env.AUTH_SERVICE || "http://127.0.0.1:5005";

const CHAT_SERVICE =
  process.env.CHAT_SERVICE || "http://127.0.0.1:5006";

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
// HEALTH CHECK
// ===============================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "api-gateway"
  });
});

// ===============================
// DESTINATIONS
// ===============================

app.get("/destinations", requireAuth, async (req, res) => {
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

app.get("/destinations/:id", requireAuth, async (req, res) => {
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

app.get("/recommendations", requireAuth, async (req, res) => {
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
// GET ITINERARIES (own only)
// ===============================

app.get("/itineraries", requireAuth, async (req, res) => {
  try {
    const response = await fetch(
      ITINERARY_SERVICE +
        "/itineraries/user/" +
        encodeURIComponent(req.user.id)
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
// GET SINGLE ITINERARY
// ===============================

app.get("/itineraries/:id", requireAuth, async (req, res) => {
  try {
    const response = await fetch(
      ITINERARY_SERVICE +
        "/itineraries/" +
        encodeURIComponent(req.params.id)
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    if (data.userId !== req.user.id) {
      return res.status(403).json({
        message: "This itinerary belongs to another traveler"
      });
    }

    res.json(data);
  } catch (error) {
    console.error(
      "ITINERARY DETAIL ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Itinerary Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// CREATE ITINERARY
// ===============================

app.post("/itineraries", requireAuth, async (req, res) => {
  try {
    const response = await fetch(
      ITINERARY_SERVICE + "/itineraries",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...req.body,
          userId: req.user.id,
          username: req.user.username
        })
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
// CHAT - GET MESSAGES
// ===============================

app.get("/chat/messages", requireAuth, async (req, res) => {
  try {
    const response = await fetch(
      CHAT_SERVICE + "/messages"
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "CHAT GET ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Chat Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// CHAT - SEND MESSAGE
// ===============================

app.post("/chat/messages", requireAuth, async (req, res) => {
  try {
    const response = await fetch(
      CHAT_SERVICE + "/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: req.body.message,
          username: req.user.username
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(201).json(data);
  } catch (error) {
    console.error(
      "CHAT POST ERROR:",
      error.message
    );

    res.status(503).json({
      message: "Chat Service unavailable",
      error: error.message
    });
  }
});

// ===============================
// AUTH SERVICE
// ===============================

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

  console.log(
    "Chat Service: " +
      CHAT_SERVICE
  );
});
