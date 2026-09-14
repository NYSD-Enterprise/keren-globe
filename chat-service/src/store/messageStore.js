const fs = require("fs");
const path = require("path");

const DATA_DIR =
    process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");

const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function readMessages() {
    try {
        const raw = fs.readFileSync(MESSAGES_FILE, "utf8");
        const parsed = JSON.parse(raw);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeMessages(messages) {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    // Write to a temp file first so a crash mid-write cannot truncate the store.
    const tempFile = MESSAGES_FILE + ".tmp";

    fs.writeFileSync(tempFile, JSON.stringify(messages, null, 2));
    fs.renameSync(tempFile, MESSAGES_FILE);
}

module.exports = {
    MESSAGES_FILE,
    readMessages,
    writeMessages
};
