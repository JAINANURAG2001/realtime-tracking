
const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle socket connections
io.on("connection", function (socket) {
  console.log("New connection: ", socket.id);

  // When a user sends location data
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // When a user disconnects
  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
    console.log("User disconnected: ", socket.id);
  });
});

// Serve the main page
app.get("/", function (req, res) {
  
  res.render("index");
});

// Start the server on port 4500
server.listen(4500, () => {
  console.log("Server running on http://localhost:4500");
});
