const fs = require("fs");
const path = require("path");

const DATA_DIR =
  process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");

const ITINERARIES_FILE = path.join(DATA_DIR, "itineraries.json");

function readItineraries() {
  try {
    const raw = fs.readFileSync(ITINERARIES_FILE, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeItineraries(itineraries) {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Write to a temp file first so a crash mid-write cannot truncate the store.
  const tempFile = ITINERARIES_FILE + ".tmp";

  fs.writeFileSync(tempFile, JSON.stringify(itineraries, null, 2));
  fs.renameSync(tempFile, ITINERARIES_FILE);
}

module.exports = {
  ITINERARIES_FILE,
  readItineraries,
  writeItineraries
};
