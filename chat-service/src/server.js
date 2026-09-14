 const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5006;

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Temporary in-memory messages
let messages = [
    {
        id: 1,
        username: "GlobeTrotter",
        message: "Welcome to the GlobeTrotter community chat!",
        timestamp: new Date().toISOString()
    }
];

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "chat-service"
    });
});

// Service information
app.get("/", (req, res) => {
    res.status(200).json({
        service: "chat-service",
        status: "running",
        port: PORT
    });
});

// Get chat messages
app.get("/messages", (req, res) => {
    res.status(200).json({
        messages
    });
});

// Send a message through REST
app.post("/messages", (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({
            message: "Username and message are required"
        });
    }

    const newMessage = {
        id: messages.length + 1,
        username,
        message,
        timestamp: new Date().toISOString()
    };

    messages.push(newMessage);

    // Send message to all connected users
    io.emit("new-message", newMessage);

    res.status(201).json({
        message: "Message sent successfully",
        chatMessage: newMessage
    });
});

// Real-time Socket.IO connection
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.emit("chat-history", messages);

    socket.on("send-message", (data) => {
        const { username, message } = data;

        if (!username || !message) {
            return;
        }

        const newMessage = {
            id: messages.length + 1,
            username,
            message,
            timestamp: new Date().toISOString()
        };

        messages.push(newMessage);

        io.emit("new-message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Chat Service running on http://localhost:${PORT}`);
});
