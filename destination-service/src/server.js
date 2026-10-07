const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/destinations.json");

function getDestinations() {
    if (!fs.existsSync(dataFilePath)) return [];
    return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
}

function saveDestinations(destinations) {
    fs.writeFileSync(dataFilePath, JSON.stringify(destinations, null, 2));
}

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Destination Service is running",
        service: "destination-service",
        port: 5002
    });
});

// GET all destinations
app.get("/destinations", (req, res) => {
    res.status(200).json(getDestinations());
});

// SEARCH destinations
app.get("/destinations/search", (req, res) => {
    const keyword = req.query.name?.trim();

    if (!keyword) {
        return res.status(200).json(getDestinations());
    }

    const results = getDestinations().filter(destination =>
        destination.name.toLowerCase().includes(keyword.toLowerCase()) ||
        destination.country.toLowerCase().includes(keyword.toLowerCase())
    );

    res.status(200).json(results);
});

// CREATE destination
app.post("/destinations", (req, res) => {
    const {
        name,
        country,
        category,
        description
    } = req.body;

    if (!name || !country || !category || !description) {
        return res.status(400).json({
            message: "Name, country, category, and description are required"
        });
    }

    const newDestination = {
        id: Date.now(),
        name,
        country,
        category,
        description
    };

    const destinations = getDestinations();
    destinations.push(newDestination);
    saveDestinations(destinations);

    res.status(201).json({
        message: "Destination created successfully",
        destination: newDestination
    });
});

const PORT = 5002;

app.listen(PORT, () => {
    console.log(`Destination Service running on http://localhost:${PORT}`);
});