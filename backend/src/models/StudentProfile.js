import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    admissionNumber: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    section: { type: String, default: "A" },
    dateOfBirth: Date,
    guardianName: String,
    guardianPhone: String,
    address: String,
    bloodGroup: String,
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);
