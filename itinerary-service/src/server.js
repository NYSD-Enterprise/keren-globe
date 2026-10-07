const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/itineraries.json");

function getItineraries() {
    if (!fs.existsSync(dataFilePath)) return [];
    return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
}

function saveItineraries(itineraries) {
    fs.writeFileSync(dataFilePath, JSON.stringify(itineraries, null, 2));
}

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Itinerary Service is running",
        service: "itinerary-service",
        port: 5003
    });
});

// GET all itineraries
app.get("/itineraries", (req, res) => {
    res.status(200).json({
        message: "All itineraries",
        itineraries: getItineraries()
    });
});

// CREATE itinerary
app.post("/itineraries", (req, res) => {
    const {
        userId,
        destination,
        days
    } = req.body;

    if (!userId || !destination || !days) {
        return res.status(400).json({
            error: "userId, destination, and days are required"
        });
    }

    const newItinerary = {
        id: crypto.randomUUID(),
        userId,
        destination,
        days
    };

    const itineraries = getItineraries();
    itineraries.push(newItinerary);
    saveItineraries(itineraries);

    res.status(201).json({
        message: "Itinerary created successfully",
        itinerary: newItinerary
    });
});

const PORT = 5003;

app.listen(PORT, () => {
    console.log(`Itinerary Service running on http://localhost:${PORT}`);
});