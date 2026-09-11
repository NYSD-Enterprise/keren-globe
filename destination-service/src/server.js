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
    category: "Wildlife",
    description:
      "A vibrant city known for wildlife, safari experiences, and national parks.",
    latitude: -1.2921,
    longitude: 36.8219,
  },

  {
    id: 5,
    name: "London",
    country: "United Kingdom",
    category: "History",
    description:
      "A historic city filled with famous landmarks, museums, culture, and entertainment.",
    latitude: 51.5074,
    longitude: -0.1278,
  },

  {
    id: 6,
    name: "Rome",
    country: "Italy",
    category: "History",
    description:
      "An ancient city famous for its architecture, historic landmarks, and Italian culture.",
    latitude: 41.9028,
    longitude: 12.4964,
  },

  {
    id: 7,
    name: "Cairo",
    country: "Egypt",
    category: "Ancient",
    description:
      "A historic city and gateway to the pyramids and ancient Egyptian civilization.",
    latitude: 30.0444,
    longitude: 31.2357,
  },

  {
    id: 8,
    name: "ICT University",
    country: "Cameroon",
    city: "Yaoundé",
    area: "Messassi",
    category: "Education",
    description:
      "ICT University campus in Messassi, Yaoundé.",
    latitude: 3.9436,
    longitude: 11.5678,
  },

  {
    id: 9,
    name: "Mount Cameroon",
    country: "Cameroon",
    city: "Buea",
    area: "Southwest Region",
    category: "Mountain",
    description:
      "One of Africa's highest volcanic mountains and a popular destination for hiking and nature exploration.",
    latitude: 4.2037,
    longitude: 9.1703,
  },

  {
    id: 10,
    name: "Kribi Beach",
    country: "Cameroon",
    city: "Kribi",
    area: "South Region",
    category: "Beach",
    description:
      "A beautiful coastal destination known for beaches, ocean views, and a relaxed atmosphere.",
    latitude: 2.9406,
    longitude: 9.9103,
  },

  {
    id: 11,
    name: "Limbe Beach",
    country: "Cameroon",
    city: "Limbe",
    area: "Southwest Region",
    category: "Beach",
    description:
      "A popular coastal destination with black volcanic sand, ocean views, and nearby attractions.",
    latitude: 4.0167,
    longitude: 9.2167,
  },

  {
    id: 12,
    name: "Mefou National Park",
    country: "Cameroon",
    city: "Yaoundé",
    area: "Centre Region",
    category: "Wildlife",
    description:
      "A wildlife sanctuary near Yaoundé where visitors can experience Cameroon's rich biodiversity.",
    latitude: 3.7447,
    longitude: 11.5167,
  },

  {
    id: 13,
    name: "Waza National Park",
    country: "Cameroon",
    city: "Waza",
    area: "Far North Region",
    category: "Wildlife",
    description:
      "A famous national park known for wildlife, savanna landscapes, and safari experiences.",
    latitude: 11.3447,
    longitude: 14.6917,
  },

  {
    id: 14,
    name: "Bamenda",
    country: "Cameroon",
    city: "Bamenda",
    area: "Northwest Region",
    category: "Mountain",
    description:
      "A highland city surrounded by beautiful hills, valleys, and scenic landscapes.",
    latitude: 5.9597,
    longitude: 10.1459,
  },

  {
    id: 15,
    name: "National Museum of Yaoundé",
    country: "Cameroon",
    city: "Yaoundé",
    area: "Centre Region",
    category: "Museum",
    description:
      "A cultural museum showcasing Cameroon's history, heritage, art, and traditional culture.",
    latitude: 3.8626,
    longitude: 11.5186,
  },

  {
    id: 16,
    name: "Yaoundé",
    country: "Cameroon",
    city: "Yaoundé",
    area: "Centre Region",
    category: "City",
    description:
      "The capital city of Cameroon, known for its green hills, cultural attractions, museums, markets, and vibrant city life.",
    latitude: 3.8480,
    longitude: 11.5021,
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "Destination Service is running",
    service: "destination-service",
    port: process.env.PORT || 5002,
  });
});

app.get("/destinations", (req, res) => {
  res.status(200).json(destinations);
});

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

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(
    `Destination Service is running on http://localhost:${PORT}`
  );
});