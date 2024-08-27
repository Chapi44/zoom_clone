const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
// const io = require("socket.io")(server);

const io = require("socket.io")(server, {
  transports: ["websocket"],
});


// Peer

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server.listen(process.env.PORT || 3030);



// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// const io = require("socket.io")(server);

// const { ExpressPeerServer } = require("peer");
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
// });

// // Middleware
// app.use(express.json());
// app.use("/peerjs", peerServer);

// // API Routes
// app.post("/api/room", (req, res) => {
//   const roomId = uuidv4();
//   res.json({ roomId });
// });

// app.post("/api/room/:roomId/join", (req, res) => {
//   const { roomId } = req.params;
//   const { userId } = req.body;

//   io.of("/").in(roomId).clients((error, clients) => {
//     if (error) {
//       return res.status(500).json({ error: "Error fetching clients" });
//     }

//     if (clients.length === 0) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     const socket = io.sockets.sockets.get(clients[0]);
//     if (!socket) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     socket.join(roomId);
//     socket.to(roomId).broadcast.emit("user-connected", userId);

//     res.json({ message: "Successfully joined room" });
//   });
// });

// app.post("/api/room/:roomId/message", (req, res) => {
//   const { roomId } = req.params;
//   const { message } = req.body;

//   io.to(roomId).emit("createMessage", message);
//   res.json({ message: "Message sent" });
// });

// // Start the server
// const PORT = process.env.PORT || 3030;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
