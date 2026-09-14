const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// ITINERARY SERVICE
// ==========================================

let itineraries = [
    {
        id: 1,
        userId: "adb349a5-57f4-4d0e-9555-eea726f31a27",
        destination: "Paris",
        days: 5
    },
    {
        id: 2,
        userId: "demo-user",
        destination: "Dubai",
        days: 4
    }
];

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
        itineraries
    });
});

// ==========================================
// GET ITINERARY BY ID
// ==========================================

app.get("/itineraries/:id", (req, res) => {
    const id = Number(req.params.id);

    const itinerary = itineraries.find(
        item => item.id === id
    );

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
        destination,
        days
    } = req.body;

    if (!userId || !destination || !days) {
        return res.status(400).json({
            message: "userId, destination and days are required"
        });
    }

    const newItinerary = {
        id: itineraries.length + 1,
        userId,
        destination,
        days: Number(days),
        createdAt: new Date().toISOString()
    };

    itineraries.push(newItinerary);

    res.status(201).json({
        message: "Itinerary created successfully",
        itinerary: newItinerary
    });
});

// ==========================================
// UPDATE ITINERARY
// ==========================================

app.put("/itineraries/:id", (req, res) => {

    const id = Number(req.params.id);

    const itinerary = itineraries.find(
        item => item.id === id
    );

    if (!itinerary) {
        return res.status(404).json({
            message: "Itinerary not found"
        });
    }

    const {
        destination,
        days
    } = req.body;

    if (destination !== undefined) {
        itinerary.destination = destination;
    }

    if (days !== undefined) {
        itinerary.days = Number(days);
    }

    res.status(200).json({
        message: "Itinerary updated successfully",
        itinerary
    });
});

// ==========================================
// DELETE ITINERARY
// ==========================================

app.delete("/itineraries/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = itineraries.findIndex(
        item => item.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Itinerary not found"
        });
    }

    const deletedItinerary = itineraries.splice(index, 1);

    res.status(200).json({
        message: "Itinerary deleted successfully",
        itinerary: deletedItinerary[0]
    });
});

// ==========================================
// GET ITINERARIES FOR A USER
// ==========================================

app.get("/itineraries/user/:userId", (req, res) => {

    const userId = req.params.userId;

    const userItineraries = itineraries.filter(
        itinerary => itinerary.userId === userId
    );

    res.status(200).json({
        message: "User itineraries",
        itineraries: userItineraries
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
});