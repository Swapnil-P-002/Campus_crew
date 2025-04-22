const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const usersFilePath = path.join(__dirname, "users.json");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let users = [];

  if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath));
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  let users = [];

  if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath));
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  users.push({ username, password });
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("file message", (data) => {
    data.time = new Date().toISOString();
    io.emit("file message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
