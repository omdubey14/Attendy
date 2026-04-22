import http from "http";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./config/socket.js";
 import cors from "cors";

const startServer = async () => {
  await connectDatabase();
 

app.use(cors({
  origin: "https://attendy-fjbb.vercel.app/"
}));

  const server = http.createServer(app);
  const io = initSocket(server);

  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => {
      socket.join(`user:${userId}`);
    });
  });

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
