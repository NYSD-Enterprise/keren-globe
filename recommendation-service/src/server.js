 require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// CONFIGURATION
// =====================================================

const DESTINATION_SERVICE =
  process.env.DESTINATION_SERVICE || "http://localhost:5002";

const PORT = process.env.PORT || 5004;

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Recommendation Service is running",
    service: "recommendation-service",
    port: PORT
  });
});

// =====================================================
// GET RECOMMENDATIONS
// =====================================================

app.get("/recommendations", async (req, res) => {
  try {
    const category = req.query.category;

    console.log(
      "Fetching destinations from:",
      `${DESTINATION_SERVICE}/destinations`
    );

    const response = await fetch(
      `${DESTINATION_SERVICE}/destinations`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Destination Service returned an error"
      });
    }

    const data = await response.json();

    let destinations = Array.isArray(data)
      ? data
      : data.destinations || [];

    // =================================================
    // FILTER BY CATEGORY IF PROVIDED
    // =================================================

    if (category) {
      destinations = destinations.filter(
        (destination) =>
          destination.category &&
          destination.category.toLowerCase() ===
            category.toLowerCase()
      );
    }

    // =================================================
    // RETURN RECOMMENDATIONS
    // =================================================

    res.json({
      message: "Recommended destinations",
      count: destinations.length,
      recommendations: destinations
    });

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

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    route: req.originalUrl
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Recommendation Service running on http://localhost:${PORT}`
  );
});
