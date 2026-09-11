 const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
res.json({
message: "Auth Service is running",
service: "auth-service",
port: process.env.PORT || 5005
});
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
console.log(`Auth Service running on port ${PORT}`);
});
