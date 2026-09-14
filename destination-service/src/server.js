require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    category: "City",
    description:
      "The City of Light, famous for the Eiffel Tower, art, fashion, and culture.",
    latitude: 48.8566,
    longitude: 2.3522,
  },

  {
    id: 2,
    name: "Dubai",
    country: "UAE",
    category: "Luxury",
    description:
      "A modern city famous for world-class attractions, shopping, and architecture.",
    latitude: 25.2048,
    longitude: 55.2708,
  },

  {
    id: 3,
    name: "Cape Town",
    country: "South Africa",
    category: "Beach",
    description:
      "A beautiful coastal city surrounded by mountains, beaches, and natural attractions.",
    latitude: -33.9249,
    longitude: 18.4241,
  },

  {
    id: 4,
    name: "Nairobi",
    country: "Kenya",
    category: "Nature",
    description:
      "A vibrant African city known for wildlife, national parks, and cultural attractions.",
    latitude: -1.2921,
    longitude: 36.8219,
  },

  {
    id: 5,
    name: "London",
    country: "United Kingdom",
    category: "City",
    description:
      "A historic and modern city famous for landmarks, museums, shopping, and culture.",
    latitude: 51.5074,
    longitude: -0.1278,
  },

  {
    id: 6,
    name: "Rome",
    country: "Italy",
    category: "History",
    description:
      "The Eternal City, home to the Colosseum, Vatican City, ancient ruins, and Italian culture.",
    latitude: 41.9028,
    longitude: 12.4964,
  },

  {
    id: 7,
    name: "Cairo",
    country: "Egypt",
    category: "History",
    description:
      "A historic city famous for the Pyramids of Giza, ancient Egyptian civilization, and the Nile.",
    latitude: 30.0444,
    longitude: 31.2357,
  },

  {
    id: 8,
    name: "Yaoundé",
    country: "Cameroon",
    category: "City",
    description:
      "The capital of Cameroon, known for its hills, cultural attractions, and vibrant city life.",
    latitude: 3.848,
    longitude: 11.5021,
  },

  {
    id: 9,
    name: "Bamenda",
    country: "Cameroon",
    category: "Nature",
    description:
      "A scenic city in northwestern Cameroon surrounded by hills, valleys, and beautiful landscapes.",
    latitude: 5.9597,
    longitude: 10.1459,
  },

  {
    id: 10,
    name: "Limbe Beach",
    country: "Cameroon",
    category: "Beach",
    description:
      "A beautiful coastal destination known for black volcanic sand beaches, ocean views, and relaxing scenery.",
    latitude: 4.0236,
    longitude: 9.2067,
  },

  {
    id: 11,
    name: "Mount Cameroon",
    country: "Cameroon",
    category: "Adventure",
    description:
      "One of Africa's highest volcanoes, offering hiking, adventure, and spectacular natural scenery.",
    latitude: 4.2035,
    longitude: 9.1705,
  },

  {
    id: 12,
    name: "Kribi Beach",
    country: "Cameroon",
    category: "Beach",
    description:
      "A popular coastal destination known for sandy beaches, warm waters, and relaxing seaside experiences.",
    latitude: 2.9373,
    longitude: 9.9077,
  },

  {
    id: 13,
    name: "Mefou National Park",
    country: "Cameroon",
    category: "Nature",
    description:
      "A wildlife sanctuary near Yaoundé where visitors can experience Cameroon's rich biodiversity.",
    latitude: 3.6589,
    longitude: 11.5821,
  },

  {
    id: 14,
    name: "Waza National Park",
    country: "Cameroon",
    category: "Wildlife",
    description:
      "A famous wildlife park in northern Cameroon known for elephants, lions, giraffes, and other animals.",
    latitude: 11.335,
    longitude: 14.6417,
  },

  {
    id: 15,
    name: "ICT University",
    country: "Cameroon",
    category: "Education",
    description:
      "A technology-focused university in Yaoundé known for ICT education and innovation.",
    latitude: 3.848,
    longitude: 11.5021,
  },

  {
    id: 16,
    name: "Foumban",
    country: "Cameroon",
    category: "Culture",
    description:
      "A historic cultural destination known for the Bamoun Kingdom, traditional arts, crafts, and museums.",
    latitude: 5.7266,
    longitude: 10.898,
  },
];

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Destination Service is running",
    service: "destination-service",
    port: process.env.PORT || 5002,
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "destination-service",
  });
});

// ===============================
// GET ALL DESTINATIONS
// ===============================

app.get("/destinations", (req, res) => {
  res.status(200).json(destinations);
});

// ===============================
// GET SINGLE DESTINATION
// ===============================

app.get("/destinations/:id", (req, res) => {
  const destination = destinations.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!destination) {
    return res.status(404).json({
      message: "Destination not found",
    });
  }

  res.status(200).json(destination);
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(
    `Destination Service is running on http://localhost:${PORT}`
  );
});