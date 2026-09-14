const fs = require("fs");
const path = require("path");

const DATA_DIR =
  process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");

const USERS_FILE = path.join(DATA_DIR, "users.json");

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Write to a temp file first so a crash mid-write cannot truncate the store.
  const tempFile = USERS_FILE + ".tmp";

  fs.writeFileSync(tempFile, JSON.stringify(users, null, 2));
  fs.renameSync(tempFile, USERS_FILE);
}

function findByEmail(email) {
  const target = String(email).toLowerCase().trim();

  return readUsers().find(user => user.email === target);
}

function addUser(user) {
  const users = readUsers();

  users.push(user);
  writeUsers(users);

  return user;
}

module.exports = {
  USERS_FILE,
  readUsers,
  writeUsers,
  findByEmail,
  addUser
};
