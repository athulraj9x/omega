const socketIO = require("socket.io");
const mongoose = require("mongoose");
const { User } = require("../models");
const { setSocketServer } = require("./socketIoInstance");

let io;
let sessions = {};

function createSocketServer(server) {
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
  });

  io.use((socket, next) => {
    console.log({ "socket.id": socket.id })
    if (true) {
      next();
    }
  });
  setSocketServer(io);
  io.on("connection", (socket) => {
    console.log("user connected into socket  -->", socket.id);
    console.log("user connected into socket  -->", socket.roomId);
    let peers = {};
    peers[socket.id] = socket;

    socket.on("connectWithSession", (sessionData) => {
      const { sessionId, token } = sessionData;
      if (!sessionId || !sessions[sessionId]) {
        let session = sessionData.sessionId;
        session = generateUniqueSessionId();
        console.log("New session created:", session);

        sessions[session] = {
          userId: socket.id,
          socketId: socket.id,
        };
        socket.emit("sessionId", { session });
      } else {
        console.log("Reconnected session:", sessionId);
        socket.emit("sessionId", { sessionId });
      }
    });

    return io;
  })

}
function getIoInstance() {
  if (!io) {
    throw new Error(
      "Socket.io instance has not been initialized. Call createSocketServer first."
    );
  }
  console.log("Socket.io instance has been initialized");
  return io;
}

module.exports = { createSocketServer, getIoInstance };
