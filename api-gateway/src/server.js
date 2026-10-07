const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const DESTINATION_API = process.env.DESTINATION_API || "http://localhost:5002";
const RECOMMENDATION_API = process.env.RECOMMENDATION_API || "http://localhost:5004";
const ITINERARY_API = process.env.ITINERARY_API || "http://localhost:5003";
const AUTH_API = process.env.AUTH_API || "http://localhost:5001";

// ============================
// GATEWAY TEST
// ============================
app.get("/", (req, res) => {
    res.json({
        message: "GlobeTrotter API Gateway is running",
        service: "api-gateway",
        port: 5000
    });
});

// ============================
// AUTH SERVICE
// ============================
app.post("/register", async (req, res) => {
    try {
        const response = await fetch(`${AUTH_API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(502).json({ message: "Auth Service unavailable", error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const response = await fetch(`${AUTH_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(502).json({ message: "Auth Service unavailable", error: error.message });
    }
});

// ============================
// DESTINATION SERVICE
// ============================
app.get("/destinations", async (req, res) => {
    try {
        const response = await fetch(`${DESTINATION_API}/destinations`);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(502).json({ message: "Destination Service unavailable", error: error.message });
    }
});

// ============================
// RECOMMENDATION SERVICE
// ============================
app.get("/recommendations", async (req, res) => {
    try {
        const response = await fetch(`${RECOMMENDATION_API}/recommendations`);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(502).json({ message: "Recommendation Service unavailable", error: error.message });
    }
});

// ============================
// ITINERARY SERVICE
// ============================
app.get("/itineraries", async (req, res) => {
    try {
        const response = await fetch(`${ITINERARY_API}/itineraries`);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(502).json({ message: "Itinerary Service unavailable", error: error.message });
    }
});

// ============================
// START SERVER
// ============================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});