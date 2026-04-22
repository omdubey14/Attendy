import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token || !user?._id) return undefined;

    const serverUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(
      "/api/v1",
      ""
    );
    const socketInstance = io(serverUrl, { transports: ["websocket"] });

    socketInstance.on("connect", () => {
      socketInstance.emit("join:user", user._id);
    });

    socketInstance.on("notification:new", (notification) => {
      toast(notification.title);
    });

    socketInstance.on("attendance:updated", () => {
      toast.success("Attendance updated in real time");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [token, user?._id]);

  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
};
