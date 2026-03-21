import { io } from "socket.io-client";

const socket = io("https://devcollab-2iq3.onrender.com");
//     transports: ["websocket"],
//     withCredentials: true
// });

export default socket;
