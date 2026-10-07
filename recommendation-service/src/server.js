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

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Recommendation Service is running",
        service: "recommendation-service",
        port: 5004
    });
});

// GET recommendations
app.get("/recommendations", (req, res) => {
    res.status(200).json({
        message: "Recommended destinations",
        recommendations: getDestinations()
    });
});

const PORT = 5004;

app.listen(PORT, () => {
    console.log(`Recommendation Service running on http://localhost:${PORT}`);
});