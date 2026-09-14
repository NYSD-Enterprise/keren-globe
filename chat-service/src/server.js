 const express = require("express");
const cors = require("cors");
const http = require("http");
const crypto = require("crypto");
const { Server } = require("socket.io");

const store = require("./store/messageStore");

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

function appendMessage(username, message) {
    const messages = store.readMessages();

    const newMessage = {
        id: crypto.randomUUID(),
        username,
        message,
        timestamp: new Date().toISOString()
    };

    messages.push(newMessage);
    store.writeMessages(messages);

    return newMessage;
}

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
        messages: store.readMessages()
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

    const newMessage = appendMessage(username, message);

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

    socket.emit("chat-history", store.readMessages());

    socket.on("send-message", (data) => {
        const { username, message } = data;

        if (!username || !message) {
            return;
        }

        io.emit("new-message", appendMessage(username, message));
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Chat Service running on http://localhost:${PORT}`);
    console.log(`Messages stored in ${store.MESSAGES_FILE}`);
});
