const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const store = require("./store/itineraryStore");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// ITINERARY SERVICE
// ==========================================

function normalizeDestinations(value) {
    const list = Array.isArray(value) ? value : [value];

    return list
        .map(item => String(item || "").trim())
        .filter(Boolean);
}

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "itinerary-service"
    });
});

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        service: "itinerary-service",
        status: "running"
    });
});

// ==========================================
// GET ALL ITINERARIES
// ==========================================

app.get("/itineraries", (req, res) => {
    res.status(200).json({
        message: "All itineraries",
        itineraries: store.readItineraries()
    });
});

// ==========================================
// GET ITINERARIES FOR A USER
// Declared before "/itineraries/:id" so "user" is not read as an id.
// ==========================================

app.get("/itineraries/user/:userId", (req, res) => {

    const userItineraries = store
        .readItineraries()
        .filter(itinerary => itinerary.userId === req.params.userId);

    res.status(200).json({
        message: "User itineraries",
        itineraries: userItineraries
    });
});

// ==========================================
// GET ITINERARY BY ID
// ==========================================

app.get("/itineraries/:id", (req, res) => {

    const itinerary = store
        .readItineraries()
        .find(item => item.id === req.params.id);

    if (!itinerary) {
        return res.status(404).json({
            message: "Itinerary not found"
        });
    }

    res.status(200).json(itinerary);
});

// ==========================================
// CREATE ITINERARY
// ==========================================

app.post("/itineraries", (req, res) => {

    const {
        userId,
        username,
        title,
        destination,
        destinations,
        days
    } = req.body;

    const selected = normalizeDestinations(
        destinations !== undefined ? destinations : destination
    );

    if (!userId || selected.length === 0 || !days) {
        return res.status(400).json({
            message: "userId, at least one destination and days are required"
        });
    }

    const newItinerary = {
        id: crypto.randomUUID(),
        userId,
        username: username || null,
        title: (title && String(title).trim()) || selected.join(" \u2192 "),
        destinations: selected,
        days: Number(days),
        createdAt: new Date().toISOString()
    };

    const itineraries = store.readItineraries();

    itineraries.push(newItinerary);
    store.writeItineraries(itineraries);

    res.status(201).json({
        message: "Itinerary created successfully",
        itinerary: newItinerary
    });
});

// ==========================================
// UPDATE ITINERARY
// ==========================================

app.put("/itineraries/:id", (req, res) => {

    const itineraries = store.readItineraries();

    const itinerary = itineraries.find(
        item => item.id === req.params.id
    );

    if (!itinerary) {
        return res.status(404).json({
            message: "Itinerary not found"
        });
    }

    const {
        title,
        destination,
        destinations,
        days
    } = req.body;

    if (title !== undefined) {
        itinerary.title = String(title).trim();
    }

    if (destinations !== undefined || destination !== undefined) {
        itinerary.destinations = normalizeDestinations(
            destinations !== undefined ? destinations : destination
        );
    }

    if (days !== undefined) {
        itinerary.days = Number(days);
    }

    store.writeItineraries(itineraries);

    res.status(200).json({
        message: "Itinerary updated successfully",
        itinerary
    });
});

// ==========================================
// DELETE ITINERARY
// ==========================================

app.delete("/itineraries/:id", (req, res) => {

    const itineraries = store.readItineraries();

    const index = itineraries.findIndex(
        item => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Itinerary not found"
        });
    }

    const deletedItinerary = itineraries.splice(index, 1);

    store.writeItineraries(itineraries);

    res.status(200).json({
        message: "Itinerary deleted successfully",
        itinerary: deletedItinerary[0]
    });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(
        `Itinerary Service running on http://localhost:${PORT}`
    );

    console.log(
        `Itineraries stored in ${store.ITINERARIES_FILE}`
    );
});