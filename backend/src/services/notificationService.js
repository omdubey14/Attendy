import { Notification } from "../models/Notification.js";
import { getSocket } from "../config/socket.js";

export const sendNotification = async ({
  recipient,
  title,
  message,
  category = "general",
  metadata = {},
}) => {
  const notification = await Notification.create({
    recipient,
    title,
    message,
    category,
    metadata,
  });

  try {
    const io = getSocket();
    io.to(`user:${recipient}`).emit("notification:new", notification);
  } catch (_error) {
    // Database delivery still works when the socket server is not active.
  }

  return notification;
};
