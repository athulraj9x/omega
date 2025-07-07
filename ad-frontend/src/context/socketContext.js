import { createContext } from "react";
import { io } from "socket.io-client";
export const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports: ["websocket"], // Adding this might help if the socket transport method causes issues
});

export const SocketContext = createContext();
