import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env.js";

const uploadDirectory = path.resolve(process.cwd(), env.uploadDir);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirectory),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});

export const upload = multer({ storage });
