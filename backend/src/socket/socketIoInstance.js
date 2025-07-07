// utils/socketIoInstance.js

let ioInstance = null;

function setSocketServer(io) {
  ioInstance = io;
}

function getSocketServer() {
  if (!ioInstance) {
    throw new Error("Socket.io instance has not been set.");
  }
  return ioInstance;
}

module.exports = {
  setSocketServer,
  getSocketServer,
};
