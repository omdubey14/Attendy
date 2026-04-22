import mongoose from "mongoose";
import { env } from "./env.js";

const getMongoTarget = (uri) => {
  if (!uri) {
    return "unknown";
  }

  const srvMatch = uri.match(/^mongodb\+srv:\/\/(?:[^@]+@)?([^/?]+)/i);
  if (srvMatch) {
    return srvMatch[1];
  }

  const standardMatch = uri.match(/^mongodb:\/\/(?:[^@]+@)?([^/?]+)/i);
  if (standardMatch) {
    return standardMatch[1];
  }

  return "unknown";
};

const getErrorSnapshot = (error) => {
  const codes = [error?.code, error?.cause?.code].filter(Boolean);
  const messages = [error?.message, error?.cause?.message]
    .filter(Boolean)
    .join(" ");

  return {
    code: codes[0],
    message: messages,
  };
};

const buildConnectionHelp = (error) => {
  const isAtlasSrv = env.mongoUri.startsWith("mongodb+srv://");
  const isLocalMongo = env.mongoUri.includes("127.0.0.1:27017");
  const { code, message } = getErrorSnapshot(error);

  if (
    (error?.syscall === "querySrv" && code === "ECONNREFUSED") ||
    /querySrv ECONNREFUSED/i.test(message)
  ) {
    return [
      "MongoDB Atlas SRV lookup failed before the app could connect.",
      "If you are running this project locally, set MONGODB_URI to mongodb://127.0.0.1:27017/student_management_system and start MongoDB.",
      "If you intended to use Atlas, check your internet connection, DNS, firewall/VPN settings, and Atlas network access.",
    ].join(" ");
  }

  if (
    isLocalMongo &&
    (code === "ECONNREFUSED" || /ECONNREFUSED 127\.0\.0\.1:27017/i.test(message))
  ) {
    return "Local MongoDB is not running on 127.0.0.1:27017. Start MongoDB, then run the backend again.";
  }

  if (isAtlasSrv && /ENOTFOUND|ETIMEOUT/i.test(code || "")) {
    return "MongoDB Atlas could not be reached. Check your DNS/internet connection and Atlas IP/network access settings.";
  }

  return null;
};

export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    const help = buildConnectionHelp(error);
    const target = getMongoTarget(env.mongoUri);

    console.error(`MongoDB connection failed for ${target}`);

    if (help) {
      console.error(help);
    }

    throw error;
  }
};
