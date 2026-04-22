import mongoose from "mongoose";

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    qualification: { type: String, default: "" },
    subjects: [{ type: String }],
  },
  { timestamps: true }
);

export const TeacherProfile = mongoose.model(
  "TeacherProfile",
  teacherProfileSchema
);
